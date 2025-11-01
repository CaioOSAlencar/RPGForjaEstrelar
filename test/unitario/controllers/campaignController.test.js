import { createNewCampaign, listUserCampaigns, invitePlayerByEmail, acceptInvite, joinByRoomCode, removePlayer } from '../../../src/controllers/campaignController.js';

describe('Campaign Controller', () => {
  test('createNewCampaign function exists', () => {
    expect(typeof createNewCampaign).toBe('function');
  });

  test('listUserCampaigns function exists', () => {
    expect(typeof listUserCampaigns).toBe('function');
  });

  test('invitePlayerByEmail function exists', () => {
    expect(typeof invitePlayerByEmail).toBe('function');
  });

  test('acceptInvite function exists', () => {
    expect(typeof acceptInvite).toBe('function');
  });

  test('joinByRoomCode function exists', () => {
    expect(typeof joinByRoomCode).toBe('function');
  });

  test('removePlayer function exists', () => {
    expect(typeof removePlayer).toBe('function');
  });
});