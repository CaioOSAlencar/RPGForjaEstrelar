import { createSheet, getCampaignSheets, getSheetById, updateSheet, deleteSheet, rollDiceFromSheet } from '../../../src/controllers/characterSheetController.js';

describe('Character Sheet Controller', () => {
  test('createSheet function exists', () => {
    expect(typeof createSheet).toBe('function');
  });

  test('getCampaignSheets function exists', () => {
    expect(typeof getCampaignSheets).toBe('function');
  });

  test('getSheetById function exists', () => {
    expect(typeof getSheetById).toBe('function');
  });

  test('updateSheet function exists', () => {
    expect(typeof updateSheet).toBe('function');
  });

  test('deleteSheet function exists', () => {
    expect(typeof deleteSheet).toBe('function');
  });

  test('rollDiceFromSheet function exists', () => {
    expect(typeof rollDiceFromSheet).toBe('function');
  });
});