
import { Milestone, Apartment, Resource, DailyLogEntry } from './types';

export const milestones: Milestone[] = [
  {
    id: '1',
    focusArea: 'Potty Training',
    status: 'In Progress',
    recentProgress: 'No accidents for 2 days',
    icon: 'accessibility_new',
    color: 'blue'
  },
  {
    id: '2',
    focusArea: 'Command: Sit',
    status: 'Mastered',
    recentProgress: 'Consistent with hand signal',
    icon: 'chair',
    color: 'purple'
  },
  {
    id: '3',
    focusArea: 'Socialization',
    status: 'In Progress',
    recentProgress: 'Met 3 new people today',
    icon: 'groups',
    color: 'orange'
  }
];

export const apartments: Apartment[] = [
  {
    id: '1',
    title: 'The Lofts at River',
    price: '$2,400',
    specs: '2 Bed • 2 Bath • 1,100 sqft',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaaRCFT_R7kjkgmCCIHWLj10d2mHN-6rmb_eS9NT5cQyh-RooTrFdTeZNnxQNH1KHW2DrYJjEPVS1Wh_pWc9phh3_MBasWq_KYsAhpXO7MVvcTaYKhc5k9ruG_Bxv45ZIU8P6G4577vl04Rw7yKlrPwNXG6PwpK7tz4fLOz-Dx1D8-7mLRuT7_OnxNE2Lqq2gZZISXWBgMBp9OebhxI_AqYuG423YEfdOBIXgohoChBz_sp7ZYa4jWXPvLwrRHc79x7I7sJmLS-FE',
    status: 'Touring',
    statusIcon: 'directions_run',
    statusColor: 'bg-primary',
    petTag: 'Large Dog OK',
    petIcon: 'pets',
    // Added missing createdAt property
    createdAt: 1713963600000
  },
  {
    id: '2',
    title: 'Greenview Apts',
    price: '$2,600',
    specs: '1 Bed • 1 Bath • 850 sqft',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvZP7FlKC0puqUfpcotcWI1lqa8GefOZre8elhIic3idQI9pN4fEvGpT0Lg0_VKGipPA-hq17KU1jfDfma2o_Cn5kkELA5wGR130GmZfocypdWGkQP7uBRyWpt-IzXCnOEP22NFxOhCsrPXvVZyKSBpX75cAY7DT1NPQMQg_6Vt0S6Rmmq7dqHKcGJ3UA5sXL9FF0Z94jUieTQAfpLmL6_gQWHxyBabBWP7o3qVmCWS9suVzdv3Jg3g4A_Z7YFuXNp3GIGmV7fnZ8',
    status: 'Applied',
    statusIcon: 'hourglass_top',
    statusColor: 'bg-yellow-500',
    petTag: 'Golden Friendly',
    petIcon: 'check_circle',
    // Added missing createdAt property
    createdAt: 1713877200000
  },
  {
    id: '3',
    title: 'Sunnyside Unit 4B',
    price: '$2,350',
    specs: '2 Bed • 1 Bath • 980 sqft',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1YkNVVKyLOlIrW8n9EN8Q9opRrp5oXvZfUnEI1zas0HrxMv43lNcOWmzL3XBFcFNgiIj6jGV32dvDhyepx08PSti1MKGN-JA3ZxHvC6SC-3O6u30wkXkvq3YJ_9JycHGfIzjifx6whuZTPO81Vmj6VdUg2rtY_V5ARCcBr-ZRo2kUC88Ccz73iGuSJb-36PXkeD2CVqLSO3ecrtgxx6usIOUc9_TXuW1XEElA2VlBOoPQQjSVXGKnajRyBTRfZDhxWozWF9qO94A',
    status: 'Contacted',
    statusIcon: 'call',
    statusColor: 'bg-gray-500',
    petTag: 'Pets Allowed',
    petIcon: 'pets',
    // Added missing createdAt property
    createdAt: 1713790800000
  }
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Leash Walking 101',
    description: 'Master the loose leash walk with these simple 5 steps from Zak George.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeL3_kkS4Nxvgr31hBqmqzp73ikS0N09-uEZ16JewnExdN6S9FSiSVwXeqz12_Dt5nyGAgEhiPe7TmElRYY7U4o0z5_F2qdRumg0nXiJznbFnzDASvdn7-T4D2-UR6ujKi-tCwCNdlKIyXbeDWDeKS4I9Ctg8qqi8_qZK9nKFIjwXtSoFN9JN8C0bv_QY1y62_MeHvMfFxByXeo2VugZp8PpZ6GkTYYyEDxLx8BjSKd5YhNdCc1V_5vRd52YS9_o7qGzW6TpasvDc',
    type: 'video'
  },
  {
    id: '2',
    title: 'Crate Training Guide',
    description: 'Download the comprehensive PDF guide for stress-free crate training nights.',
    type: 'pdf'
  },
  {
    id: '3',
    title: 'Top 10 Chew Toys',
    description: 'Durable toys for teething golden retriever puppies that last.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMttgXwlJhB_8JDUigzCJySgLoOFcdChUZq2r-MDF2Po-HlW7RQnIKbJCjQrE2i6outl7BQoJP4WBqca6P6SxR2PuEqTKNV2AYOaLek9wbMnHDXiRU5BxXEeXK1cu-UNmKKo85ady8YmN6Ft6prmJzQ09EKD43SHL-8It2Zp36u8fJmhuJTQ3Y71HbKkcZyBiLtnYHAegS3B29PKt4eIRIgXQykJGWYfB6rC4Hltba1IjnldgjBMv2xZIk-ZHrGtBgcu0uVsHKnOg',
    type: 'article'
  }
];

// Added missing 'id' property to satisfy DailyLogEntry interface
export const dailyTimeline: DailyLogEntry[] = [
  { id: 'log-1', time: '10:45 AM', label: 'Went down for a nap', type: 'Sleep' },
  { id: 'log-2', time: '10:15 AM', label: 'Potty: Pee', type: 'Pee', detail: '- Backyard' },
  { id: 'log-3', time: '09:30 AM', label: 'Potty: Poop', type: 'Poop' },
  { id: 'log-4', time: '08:00 AM', label: 'Breakfast (1.5 cups)', type: 'Meal' }
];

export const feedListings = [
  { id: 'f1', title: '900 W Randolph St', time: '2m ago', price: '$2,100', specs: '1bd • 1ba', status: 'OK', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ju6s6EVxZaWEPuDpTu5kLPHtwVYruhxFO6WWFor8jvw-VuNYG9fsAi4DQMRIPGOTQtgbxxqyhwceRt__NNl8IBCwfXy0Nnhy3ip9Lu9Bjv9smvH30IcrXRkBJgFMx0VpHfEIy6IhU1H5mi4IBJl-pv0q7wIm95iXPJ5w-uZV6HO9qx1CzanyrJqV4Bz8n6jWJ0YD76ZkzJdMoDtDvxsR4Q__JZ4TnrYHdN63O1GYozEWS-njD53UYbeWfIoFM8T7DSH3Q63Lpzs' },
  { id: 'f2', title: 'The Hudson Unit 202', time: '15m ago', price: '$2,800', specs: '2bd • 2ba', status: 'Ideal', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA39HCpUtwzfBVty0fH-uOkm1iuyYYhyMxf-rwbUAh-EaY5flg49n4rU4bLX58usDPOq1ZVmbGMybhLHmRX3vg7ECc0RCpAE_g7WDd0BrhiBDriivXdvfAtisAmUFOZPDRPQ3UmU_RZ6bfBG1EVSsZ8oY58TXuJmZ5JBjoTnCb78fBA8GDm0_8UQ2v2-o5RIywuV1TbIejfVYcnCvU_hZg4pAbGTg-Qt8DjTa-Qjh3Pr1YLch8BD-xEvA-QtnAE70XPaobeUHalyCA' },
  { id: 'f3', title: '1240 N State St', time: '1h ago', price: '$1,950', specs: 'Studio', status: 'No Pets', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOZqNnsdq15S92iYiqnLizd1ymeuwA1xYOgtGLb0sSjgndhW1xiqEzn9tV1o-oSWoZsNGwfdVg1OY1cBlqft0LKDfW7lpPzeX6-68DnOKhAnOtPwozQLflUpxewsOof8g4wXf1FymMmjtOVVZ3O2rwsPAekF2ksM0qrWWBU8pF8GQOUgPBCRllxWPHr8KePK6v1ekYLXGn_EPJCCAxFUL3zJZT4CgZTHWtFAnRHW_bu2yIGP4_yltnp-z-1OfNVsMZmck2RRayLcA' }
];
