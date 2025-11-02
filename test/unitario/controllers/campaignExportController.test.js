import { exportCampaign, importCampaign } from '../../../src/controllers/campaignExportController.js';

describe('Campaign Export Controller', () => {
  test('exportCampaign function exists', () => {
    expect(typeof exportCampaign).toBe('function');
  });

  test('importCampaign function exists', () => {
    expect(typeof importCampaign).toBe('function');
  });
});