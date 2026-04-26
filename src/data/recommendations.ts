import type { Recommendation } from '../types';

export const recommendations: Recommendation[] = [
  {
    id: 'rec-001',
    attractionId: 'wot',
    attractionName: 'Wings of Time',
    headline: "You haven't booked Wings of Time in 6 weeks",
    body: "Wings of Time is your 2nd most-booked attraction historically, but your last order was on 14 March. With school holidays approaching, securing evening show slots early protects your clients' itineraries.",
    estimatedRevenue: 920,
    priority: 'high',
    badgeLabel: 'Gap Analysis',
  },
  {
    id: 'rec-002',
    attractionId: 'ifly',
    attractionName: 'iFly Singapore',
    headline: 'iFly corporate group rate now available',
    body: "iFly has introduced a new 10+ pax group rate at SGD 89/pax (down from SGD 109). Agents similar to you in the Gold tier are booking this for corporate incentive trips. Minimum 10 pax required.",
    estimatedRevenue: 1090,
    priority: 'medium',
    badgeLabel: 'New Listing',
  },
  {
    id: 'rec-003',
    attractionId: 'acw',
    attractionName: 'Adventure Cove Waterpark',
    headline: 'Adventure Cove demand peaks in June — book ahead',
    body: "Historical data shows Adventure Cove sell-outs peak in the first week of June across the SGD 38 adult-dated tier. Agents who pre-book in April typically secure preferred date availability for school-holiday groups.",
    estimatedRevenue: 1520,
    priority: 'medium',
    badgeLabel: 'Seasonal',
  },
  {
    id: 'rec-004',
    attractionId: 'palawan',
    attractionName: 'Palawan Beach Experience',
    headline: 'Palawan Beach Day Pass newly available for B2B',
    body: "Palawan Beach Day Pass is newly listed on the Trade Portal following a partnership agreement signed in Q1 2025. At SGD 15/pax it is the most affordable Sentosa add-on for family packages.",
    estimatedRevenue: 450,
    priority: 'low',
    badgeLabel: 'New Listing',
  },
];
