const { z } = require('zod');

const dueDateSchema = z
  .union([z.string().datetime(), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value ? new Date(value) : null));

const taskPayloadSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  description: z.string().trim().max(1000).optional().default(''),
  status: z.enum(['pending', 'completed']).optional().default('pending'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: dueDateSchema,
});

const taskUpdateSchema = taskPayloadSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  'At least one field is required'
);

module.exports = { taskPayloadSchema, taskUpdateSchema };
