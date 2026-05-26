const { taskPayloadSchema } = require('./taskValidators');

describe('taskPayloadSchema', () => {
  it('accepts a valid task payload', () => {
    const result = taskPayloadSchema.safeParse({
      title: 'Prepare status report',
      description: 'Summarize completed items',
      priority: 'high',
      status: 'pending',
      dueDate: '2026-06-01T10:00:00.000Z',
    });

    expect(result.success).toBe(true);
    expect(result.data.dueDate).toBeInstanceOf(Date);
  });

  it('rejects a short title', () => {
    const result = taskPayloadSchema.safeParse({ title: 'A' });
    expect(result.success).toBe(false);
  });
});
