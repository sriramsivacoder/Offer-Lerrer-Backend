const Template = require('../models/Template');

/**
 * Template Controller
 * Handles CRUD operations for offer letter templates
 * All operations are scoped to the authenticated user
 */

// Default templates to seed for each new user
const DEFAULT_TEMPLATES = [
  {
    name: 'Professional',
    subject: 'Offer Letter - {Role} at {Partner_Name}',
    isDefault: true,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Internship Offer Letter</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Official Appointment Communication</p>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 15px; line-height: 1.7; color: #374151;">Dear <strong>{name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.7; color: #374151;">
            We are pleased to inform you that you have been selected for the position of
            <strong>{Role}</strong> at <strong>{Partner_Name}</strong>. This offer is based on your
            registration and eligibility verified through our selection process.
          </p>
          <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px 25px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px;">Internship Details</h3>
            <table style="width: 100%; font-size: 14px; color: #374151;">
              <tr><td style="padding: 6px 0; font-weight: 600; width: 40%;">Role:</td><td>{Role}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Duration:</td><td>{Duration}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Start Date:</td><td>{StartDate}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Mode:</td><td>{Mode}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Organization:</td><td>{Organization}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">AICTE Code:</td><td>{AICTE_Code}</td></tr>
            </table>
          </div>
          <p style="font-size: 15px; line-height: 1.7; color: #374151;">
            Please find your official offer letter attached as a PDF document. We look forward to
            having you on board and wish you a successful internship experience.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #374151;">
            Best regards,<br />
            <strong>{Partner_Name} Team</strong>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated email from {Partner_Name}. Please do not reply directly.</p>
        </div>
      </div>
    `,
  },
  {
    name: 'Modern',
    subject: '🎉 Welcome Aboard! Your {Role} Offer from {Partner_Name}',
    isDefault: true,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a1a1a;">
        <div style="text-align: center; padding: 40px 30px; background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #7c3aed 100%); border-radius: 16px 16px 0 0;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 800;">🎉 Congratulations!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 16px;">You've been selected for an exciting opportunity</p>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; line-height: 1.8; color: #374151;">Hey <strong>{name}</strong>! 👋</p>
          <p style="font-size: 15px; line-height: 1.8; color: #374151;">
            We're thrilled to let you know that you've been selected as a <strong>{Role}</strong>
            with <strong>{Partner_Name}</strong>! Your profile from <strong>{Organization}</strong>
            stood out, and we can't wait to have you join us.
          </p>
          <div style="background: #fafafa; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #f0f0f0;">
            <h3 style="margin: 0 0 18px; color: #111827; font-size: 16px;">📋 Quick Overview</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
              <div style="background: #eff6ff; border-radius: 8px; padding: 12px 18px; flex: 1; min-width: 200px;">
                <span style="font-size: 12px; color: #6b7280; display: block;">Role</span>
                <strong style="font-size: 14px; color: #1e40af;">{Role}</strong>
              </div>
              <div style="background: #f0fdf4; border-radius: 8px; padding: 12px 18px; flex: 1; min-width: 200px;">
                <span style="font-size: 12px; color: #6b7280; display: block;">Duration</span>
                <strong style="font-size: 14px; color: #166534;">{Duration}</strong>
              </div>
              <div style="background: #fefce8; border-radius: 8px; padding: 12px 18px; flex: 1; min-width: 200px;">
                <span style="font-size: 12px; color: #6b7280; display: block;">Starts</span>
                <strong style="font-size: 14px; color: #854d0e;">{StartDate}</strong>
              </div>
              <div style="background: #fdf2f8; border-radius: 8px; padding: 12px 18px; flex: 1; min-width: 200px;">
                <span style="font-size: 12px; color: #6b7280; display: block;">Mode</span>
                <strong style="font-size: 14px; color: #9d174d;">{Mode}</strong>
              </div>
            </div>
          </div>
          <p style="font-size: 15px; line-height: 1.8; color: #374151;">
            Your official offer letter is attached to this email as a PDF. Please review it carefully.
          </p>
          <p style="font-size: 15px; line-height: 1.8; color: #374151;">
            Excited to have you! 🚀<br />
            <strong>The {Partner_Name} Team</strong>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Sent via Offer Letter Dispatcher • {Partner_Name}</p>
        </div>
      </div>
    `,
  },
  {
    name: 'Minimal',
    subject: 'Offer Letter - {Role} | {Partner_Name}',
    isDefault: true,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 20px;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 30px;">
          <h2 style="margin: 0; color: #111827; font-weight: 700;">Offer Letter</h2>
        </div>
        <p style="font-size: 15px; line-height: 1.7; color: #374151;">Dear {name},</p>
        <p style="font-size: 15px; line-height: 1.7; color: #374151;">
          You have been selected for the role of <strong>{Role}</strong> at {Partner_Name}.
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #374151;">
          <strong>Duration:</strong> {Duration}<br />
          <strong>Start Date:</strong> {StartDate}<br />
          <strong>Mode:</strong> {Mode}<br />
          <strong>Organization:</strong> {Organization}
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #374151;">
          Please find the attached offer letter PDF for your records.
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #374151; margin-top: 30px;">
          Regards,<br />
          {Partner_Name}
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 15px;" />
        <p style="font-size: 11px; color: #9ca3af;">Auto-generated offer letter from {Partner_Name}.</p>
      </div>
    `,
  },
];

/**
 * Seed default templates for a user if none exist
 */
const seedDefaultTemplates = async (userId) => {
  const existingCount = await Template.countDocuments({ userId });
  if (existingCount > 0) return;

  const templatesWithUser = DEFAULT_TEMPLATES.map((t) => ({
    ...t,
    userId,
  }));

  await Template.insertMany(templatesWithUser);
};

/**
 * GET /api/templates
 * Fetch all templates for the current user
 */
const getTemplates = async (req, res, next) => {
  try {
    // Seed defaults if user has no templates yet
    await seedDefaultTemplates(req.user._id);

    const templates = await Template.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/templates
 * Create a new template for the current user
 */
const createTemplate = async (req, res, next) => {
  try {
    const { name, subject, html, logoUrl } = req.body;

    const template = await Template.create({
      userId: req.user._id,
      name,
      subject,
      html,
      logoUrl: logoUrl || '',
      isDefault: false,
    });

    res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/templates/:id
 * Update a template (must belong to current user)
 */
const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject, html, logoUrl } = req.body;

    const template = await Template.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, subject, html, logoUrl },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/templates/:id
 * Delete a template (must belong to current user, cannot delete last template)
 */
const deleteTemplate = async (req, res, next) => {
  try {
    const count = await Template.countDocuments({ userId: req.user._id });
    if (count <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your last template.',
      });
    }

    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/templates/:id/reset
 * Reset a default template back to its original content
 */
const resetTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    if (!template.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Only default templates can be reset.',
      });
    }

    // Find the matching default template by name
    const defaultTemplate = DEFAULT_TEMPLATES.find((d) => d.name === template.name);
    if (!defaultTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Original default template not found.',
      });
    }

    template.html = defaultTemplate.html;
    template.subject = defaultTemplate.subject;
    await template.save();

    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemplates, createTemplate, updateTemplate, deleteTemplate, resetTemplate };
