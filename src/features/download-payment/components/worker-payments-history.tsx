import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getWorkerLastCampaignsPaymentsThunk } from '../business-logic/download-payment-history.slice';
import { WorkerPaymentHistoryItem } from '../business-logic/download-payment.state';

function groupPaymentsByCampaign(items: WorkerPaymentHistoryItem[]): Record<string, WorkerPaymentHistoryItem[]> {
  return items.reduce((acc, item) => {
    const campaignId = item.campaign._id;
    if (!acc[campaignId]) {
      acc[campaignId] = [];
    }
    acc[campaignId].push(item);
    return acc;
  }, {} as Record<string, WorkerPaymentHistoryItem[]>);
}

export default function WorkerPaymentsHistory(): JSX.Element {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [grouped, setGrouped] = React.useState<Record<string, WorkerPaymentHistoryItem[]>>({});
  const [campaigns, setCampaigns] = React.useState<WorkerPaymentHistoryItem['campaign'][]>([]);

  const payments: WorkerPaymentHistoryItem[] = useAppSelector((state) => (state.downloadPaysHistory.workerPaymentsHistory));

  useEffect(() => {
    setLoading(true);
    dispatch(getWorkerLastCampaignsPaymentsThunk() as any)
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (payments.length > 0) {
      const groupedByCampaign = groupPaymentsByCampaign(payments);
      setGrouped(groupedByCampaign);
      setCampaigns(
        Object.values(payments)
          .map((item) => item.campaign)
          .filter((v, i, a) => a.findIndex(t => t._id === v._id) === i)
          .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())
      );
    }
  }, [payments]);

  if (loading) {
    return <div>Loading worker payment history...</div>;
  }

  if (campaigns.length === 0) {
    return <div>No payment history found.</div>;
  }

  return (
    <div>
      <h2>Worker Payment History</h2>
      {campaigns.map((campaign) => (
        <div key={campaign._id} style={{ marginBottom: 24, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3>Week: {new Date(campaign.dateStart).toLocaleDateString()} - {new Date(campaign.dateEnd).toLocaleDateString()}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 4 }}>Date</th>
                <th style={{ textAlign: 'right', padding: 4 }}>USD</th>
                <th style={{ textAlign: 'right', padding: 4 }}>COP Value</th>
                <th style={{ textAlign: 'right', padding: 4 }}>Worker Commission</th>
                <th style={{ textAlign: 'right', padding: 4 }}>Commission %</th>
              </tr>
            </thead>
            <tbody>
              {grouped[campaign._id]?.map((item) => (
                <tr key={item._id}>
                  <td style={{ padding: 4 }}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{item.usdValue.toLocaleString('es-CO', { style: 'currency', currency: 'USD' })}</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{item.copValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{item.worker.value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{item.worker.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
} 