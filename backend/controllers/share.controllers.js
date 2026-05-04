import Share from '../models/share.models.js';
import Quiz from '../models/quiz.models.js';
import Flashcard from '../models/flashcard.models.js';
import crypto from 'crypto';

// Generate unique share token
const generateShareToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Generate share link
const generateShareLink = async (req, res, next) => {
  try {
    const { resourceType, resourceId, expiryDays } = req.body;

    // Validate input
    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'resourceType and resourceId are required',
      });
    }

    if (!['quiz', 'flashcard'].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'resourceType must be "quiz" or "flashcard"',
      });
    }

    // Verify resource exists and belongs to user
    let resource;
    if (resourceType === 'quiz') {
      resource = await Quiz.findOne({
        _id: resourceId,
        userId: req.user._id,
      });
    } else {
      resource = await Flashcard.findOne({
        _id: resourceId,
        userId: req.user._id,
      });
    }

    if (!resource) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: `${resourceType} not found or you don't have permission to share it`,
      });
    }

    // Check if already shared
    const existingShare = await Share.findOne({
      resourceType,
      resourceId,
      userId: req.user._id,
      isActive: true,
    });

    if (existingShare) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          shareToken: existingShare.shareToken,
          shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${existingShare.shareToken}/${existingShare.resourceType}`,
          expiryDate: existingShare.expiryDate,
          createdAt: existingShare.createdAt,
        },
        message: 'Share link already exists',
      });
    }

    // Create new share
    const shareToken = generateShareToken();
    const expiryDate = expiryDays
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      : null;

    const share = await Share.create({
      shareToken,
      resourceType,
      resourceId,
      userId: req.user._id,
      expiryDate,
    });

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${shareToken}/${resourceType}`;

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        shareToken,
        shareUrl,
        expiryDate: share.expiryDate,
        createdAt: share.createdAt,
      },
      message: 'Share link created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get shared resource (public access)
const getSharedResource = async (req, res, next) => {
  try {
    const { token } = req.params;

    const share = await Share.findOne({
      shareToken: token,
      isActive: true,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Share link not found or has been revoked',
      });
    }

    // Check expiry
    if (share.expiryDate && new Date() > share.expiryDate) {
      return res.status(410).json({
        success: false,
        statusCode: 410,
        error: 'Share link has expired',
      });
    }

    // Get the actual resource
    let resource;
    if (share.resourceType === 'quiz') {
      resource = await Quiz.findById(share.resourceId).populate(
        'documentId',
        'title fileName'
      );
    } else {
      resource = await Flashcard.findById(share.resourceId).populate(
        'documentId',
        'title fileName'
      );
    }

    if (!resource) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Resource no longer exists',
      });
    }

    // Increment access count
    share.accessCount += 1;
    await share.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        resourceType: share.resourceType,
        resource,
        sharedAt: share.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all shares of current user
const getShareLinks = async (req, res, next) => {
  try {
    const shares = await Share.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Populate resource details
    const sharesWithDetails = await Promise.all(
      shares.map(async (share) => {
        let resource;
        if (share.resourceType === 'quiz') {
          resource = await Quiz.findById(share.resourceId).select('title').lean();
        } else {
          resource = await Flashcard.findById(share.resourceId)
            .select('_id')
            .lean();
        }

        return {
          ...share,
          shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${share.shareToken}/${share.resourceType}`,
          resourceTitle: resource?.title || 'Unknown',
        };
      })
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: sharesWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// Delete share link (revoke)
const deleteShareLink = async (req, res, next) => {
  try {
    const { token } = req.params;

    const share = await Share.findOne({
      shareToken: token,
      userId: req.user._id,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Share link not found',
      });
    }

    await share.deleteOne();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Share link revoked successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update share link settings
const updateShareLink = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { expiryDays, isActive } = req.body;

    const share = await Share.findOne({
      shareToken: token,
      userId: req.user._id,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Share link not found',
      });
    }

    // Update fields if provided
    if (expiryDays !== undefined) {
      share.expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    }

    if (isActive !== undefined) {
      share.isActive = isActive;
    }

    await share.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: share,
      message: 'Share link updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { generateShareLink, getSharedResource, getShareLinks, deleteShareLink, updateShareLink };
