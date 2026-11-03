import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ insert: vi.fn(), from: vi.fn() }));
vi.mock('../../lib/supabase', () => ({ supabase: { from: mocks.from } }));
import { requestPickup } from './api';
describe('solicitudes de Vamo', () => {
 beforeEach(() => { vi.clearAllMocks(); mocks.from.mockReturnValue({insert: mocks.insert}); });
 it('envía la solicitud pendiente sin confirmar automáticamente el asiento', async () => {
  mocks.insert.mockResolvedValue({error:null});
  await requestPickup({tripId:'trip',passengerId:'passenger',pickupPoint:{lat:-12.1,lng:-77.03}});
  expect(mocks.from).toHaveBeenCalledWith('pickup_requests');
  expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({trip_id:'trip',passenger_id:'passenger',status:'pending'}));
 });
 it('propaga el rechazo de la base de datos en lugar de simular una solicitud exitosa', async () => {
  const error = new Error('El viaje ya no tiene asientos'); mocks.insert.mockResolvedValue({error});
  await expect(requestPickup({tripId:'trip',passengerId:'passenger',pickupPoint:{lat:-12.1,lng:-77.03}})).rejects.toBe(error);
 });
});
