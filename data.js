// Five Senses — Mock Database
// Based on real supplier invoices for 5 Senses Pte Ltd
// 333 North Bridge Road, #B1-12, Odeon 333, Singapore 188721

const DB = {
  business: {
    name: '5 Senses Pte Ltd',
    tradeName: 'Five Senses Cafe',
    address: '333 North Bridge Road, #B1-12, Odeon 333',
    postal: '188721',
    contact: 'Shaun Foo',
    phone: '9010 7378',
    email: '333.5senses@gmail.com',
  },

  suppliers: [
    { id: 'SUP001', name: 'TheSeafoodCompany Pte Ltd', shortName: 'TheSeafoodCompany', category: 'seafood', accountId: 'DF261', terms: 'CASH', agent: 'Nick Ang', agentTel: '8065 8260' },
    { id: 'SUP002', name: 'Leong Guan Food Trading Pte Ltd', shortName: 'Leong Guan', category: 'noodles', accountId: 'NBR333', terms: 'Net 7 days', agent: null, agentTel: null },
    { id: 'SUP003', name: 'Tiong Lian Food Pte Ltd', shortName: 'Tiong Lian', category: 'meat', accountId: 'F120', terms: '30 Days', agent: 'Benson Sim-R1', agentTel: null },
    { id: 'SUP004', name: 'Sin Hwa Dee Foodstuff Industries Pte Ltd', shortName: 'Sin Hwa Dee', category: 'dry-goods', accountId: 'C-SE0109', terms: '30 Days', agent: 'Hui Yen', agentTel: null },
    { id: 'SUP005', name: 'Hai Sia Seafood Pte Ltd', shortName: 'Hai Sia', category: 'seafood', terms: 'Net 14 days', agent: null, agentTel: null },
    { id: 'SUP006', name: 'Greenlink Pte Ltd', shortName: 'Greenlink', category: 'vegetables', terms: 'COD', agent: null, agentTel: null },
  ],

  invoices: [
    {
      id: 'INV001', supplierId: 'SUP001', invoiceNo: 'B604520', date: '2026-03-07', dueDate: '2026-03-07',
      terms: 'CASH', status: 'pending', subtotal: 180.00, gst: 16.20, total: 196.20,
      items: [
        { stockId: 'P365', description: 'Prawn Van PD 26-30 (CNN05)', packSize: '1KG x 10PKT', qty: 2, uom: 'CTN', unitPrice: 90.00, amount: 180.00, category: 'seafood' },
      ],
    },
    {
      id: 'INV002', supplierId: 'SUP002', invoiceNo: 'TINV2603/03318', date: '2026-03-06', dueDate: '2026-03-13',
      terms: 'Net 7 days', status: 'paid', subtotal: 33.50, gst: 3.02, total: 36.52,
      items: [
        { description: 'Green Chilli in Vinegar (CTN x 4PKT x 3KG)', qty: 1, uom: 'PACK', unitPrice: 6.90, amount: 6.90, category: 'condiments' },
        { description: 'Hor Fun (3KG)', qty: 2, uom: 'PACK', unitPrice: 4.40, amount: 8.80, category: 'noodles' },
        { description: 'Kway Teow (3KG)', qty: 1, uom: 'PACK', unitPrice: 4.40, amount: 4.40, category: 'noodles' },
        { description: 'Yellow Noodles (3KG)', qty: 2, uom: 'PACK', unitPrice: 4.20, amount: 8.40, category: 'noodles' },
        { description: 'LG Thick Vermicelli (3KG)', qty: 1, uom: 'PACK', unitPrice: 5.00, amount: 5.00, category: 'noodles' },
      ],
    },
    {
      id: 'INV003', supplierId: 'SUP003', invoiceNo: 'IN26-TL043216', date: '2026-03-04', dueDate: '2026-04-03',
      terms: '30 Days', status: 'paid', subtotal: 40.96, gst: 3.69, total: 44.65,
      items: [
        { stockId: 'BF17-0003BR', description: 'Beef Golden Coin (Minerva) BR', qty: 3.2, uom: 'KG', unitPrice: 12.80, amount: 40.96, category: 'meat' },
      ],
    },
    {
      id: 'INV004', supplierId: 'SUP004', invoiceNo: '12443173', date: '2026-03-04', dueDate: '2026-04-03',
      terms: '30 Days', status: 'overdue', subtotal: 38.10, gst: 3.43, total: 41.53,
      items: [
        { stockId: 'T-HBF-DET01B5L', description: 'Detergent 5L', qty: 1, uom: 'TUB', unitPrice: 6.80, amount: 6.80, category: 'cleaning' },
        { stockId: 'T-EGL-FSA01C400G', description: 'Fine Salt 12x400gm', qty: 1, uom: 'DOZ', unitPrice: 3.80, amount: 3.80, category: 'dry-goods' },
        { stockId: 'T-QHB-HTW03B640M', description: 'Hua Tiao Wine (Golden Star) 640ml', qty: 2, uom: 'BOT', unitPrice: 2.00, amount: 4.00, category: 'condiments' },
        { stockId: 'T-WMB-MCF01P5K', description: 'Motor Car Flour (Windmill) 5kg', qty: 1, uom: 'PKT', unitPrice: 19.50, amount: 19.50, category: 'dry-goods' },
        { stockId: 'S-HBF-VIN01B5LA', description: 'RIV-5 SHD Artificial Vinegar 5L', qty: 1, uom: 'BOT', unitPrice: 4.00, amount: 4.00, category: 'condiments' },
      ],
    },
    {
      id: 'INV005', supplierId: 'SUP005', invoiceNo: 'HS-26030401', date: '2026-03-04', dueDate: '2026-03-18',
      terms: 'Net 14 days', status: 'paid', subtotal: 125.00, gst: 11.25, total: 136.25,
      items: [
        { description: 'Tiger Prawn 31-40 (1KG)', qty: 3, uom: 'PKT', unitPrice: 18.00, amount: 54.00, category: 'seafood' },
        { description: 'Squid Tube (1KG)', qty: 2, uom: 'PKT', unitPrice: 14.50, amount: 29.00, category: 'seafood' },
        { description: 'Fish Fillet Dory (1KG)', qty: 3, uom: 'PKT', unitPrice: 14.00, amount: 42.00, category: 'seafood' },
      ],
    },
    {
      id: 'INV006', supplierId: 'SUP006', invoiceNo: 'GL-260305-88', date: '2026-03-05', dueDate: '2026-03-05',
      terms: 'COD', status: 'paid', subtotal: 67.80, gst: 6.10, total: 73.90,
      items: [
        { description: 'Beansprouts (5KG)', qty: 2, uom: 'BAG', unitPrice: 4.50, amount: 9.00, category: 'vegetables' },
        { description: 'Kangkong (500g)', qty: 5, uom: 'BNDL', unitPrice: 1.80, amount: 9.00, category: 'vegetables' },
        { description: 'Chye Sim (500g)', qty: 4, uom: 'BNDL', unitPrice: 2.00, amount: 8.00, category: 'vegetables' },
        { description: 'Garlic Peeled (1KG)', qty: 2, uom: 'PKT', unitPrice: 6.50, amount: 13.00, category: 'vegetables' },
        { description: 'Onion (1KG)', qty: 3, uom: 'PKT', unitPrice: 2.80, amount: 8.40, category: 'vegetables' },
        { description: 'Ginger (500g)', qty: 2, uom: 'PKT', unitPrice: 3.20, amount: 6.40, category: 'vegetables' },
        { description: 'Red Chilli (500g)', qty: 3, uom: 'PKT', unitPrice: 4.00, amount: 12.00, category: 'vegetables' },
        { description: 'Lime (500g)', qty: 2, uom: 'PKT', unitPrice: 1.00, amount: 2.00, category: 'vegetables' },
      ],
    },
  ],

  staff: [
    { id: 'EMP001', name: 'Shaun Foo', role: 'Owner', type: 'full-time', salary: 5500, cpf: true, leaveEntitlement: 14, leaveUsed: 3 },
    { id: 'EMP002', name: 'Mei Ling Tan', role: 'Head Chef', type: 'full-time', salary: 3800, cpf: true, leaveEntitlement: 14, leaveUsed: 5 },
    { id: 'EMP003', name: 'Ahmad Rizal', role: 'Sous Chef', type: 'full-time', salary: 3200, cpf: true, leaveEntitlement: 14, leaveUsed: 2 },
    { id: 'EMP004', name: 'Wei Jie Lim', role: 'Server', type: 'full-time', salary: 2400, cpf: true, leaveEntitlement: 14, leaveUsed: 7 },
    { id: 'EMP005', name: 'Priya Nair', role: 'Server', type: 'part-time', hourlyRate: 12, hoursWeek: 25, cpf: false, leaveEntitlement: 7, leaveUsed: 1 },
    { id: 'EMP006', name: 'Jason Ng', role: 'Kitchen Helper', type: 'part-time', hourlyRate: 11, hoursWeek: 30, cpf: false, leaveEntitlement: 7, leaveUsed: 0 },
    { id: 'EMP007', name: 'Siti Aminah', role: 'Cashier', type: 'part-time', hourlyRate: 11.50, hoursWeek: 20, cpf: false, leaveEntitlement: 7, leaveUsed: 2 },
  ],

  timesheets: [
    { employeeId: 'EMP005', date: '2026-03-07', clockIn: '10:00', clockOut: '15:30', hours: 5.5, status: 'approved' },
    { employeeId: 'EMP005', date: '2026-03-06', clockIn: '10:00', clockOut: '16:00', hours: 6.0, status: 'approved' },
    { employeeId: 'EMP006', date: '2026-03-07', clockIn: '08:00', clockOut: '14:30', hours: 6.5, status: 'pending' },
    { employeeId: 'EMP006', date: '2026-03-06', clockIn: '08:00', clockOut: '15:00', hours: 7.0, status: 'approved' },
    { employeeId: 'EMP007', date: '2026-03-07', clockIn: '11:00', clockOut: '15:00', hours: 4.0, status: 'pending' },
    { employeeId: 'EMP007', date: '2026-03-06', clockIn: '11:00', clockOut: '16:00', hours: 5.0, status: 'approved' },
  ],

  inventory: [
    { id: 'STK001', name: 'Prawn Van PD 26-30', unit: 'CTN (10KG)', currentStock: 4, minStock: 2, shelfLife: 90, lastOrdered: '2026-03-07', category: 'seafood' },
    { id: 'STK002', name: 'Hor Fun (3KG)', unit: 'PACK', currentStock: 3, minStock: 4, shelfLife: 5, lastOrdered: '2026-03-06', category: 'noodles' },
    { id: 'STK003', name: 'Kway Teow (3KG)', unit: 'PACK', currentStock: 1, minStock: 3, shelfLife: 5, lastOrdered: '2026-03-06', category: 'noodles' },
    { id: 'STK004', name: 'Yellow Noodles (3KG)', unit: 'PACK', currentStock: 5, minStock: 4, shelfLife: 3, lastOrdered: '2026-03-06', category: 'noodles' },
    { id: 'STK005', name: 'Beef Golden Coin (Minerva)', unit: 'KG', currentStock: 2.8, minStock: 3, shelfLife: 30, lastOrdered: '2026-03-04', category: 'meat' },
    { id: 'STK006', name: 'Motor Car Flour 5kg', unit: 'PKT', currentStock: 2, minStock: 1, shelfLife: 365, lastOrdered: '2026-03-04', category: 'dry-goods' },
    { id: 'STK007', name: 'Detergent 5L', unit: 'TUB', currentStock: 1, minStock: 2, shelfLife: 730, lastOrdered: '2026-03-04', category: 'cleaning' },
    { id: 'STK008', name: 'Tiger Prawn 31-40', unit: 'PKT (1KG)', currentStock: 2, minStock: 3, shelfLife: 90, lastOrdered: '2026-03-04', category: 'seafood' },
    { id: 'STK009', name: 'Beansprouts (5KG)', unit: 'BAG', currentStock: 1, minStock: 2, shelfLife: 3, lastOrdered: '2026-03-05', category: 'vegetables' },
    { id: 'STK010', name: 'Kangkong (500g)', unit: 'BNDL', currentStock: 3, minStock: 4, shelfLife: 2, lastOrdered: '2026-03-05', category: 'vegetables' },
  ],

  categories: [
    { id: 'seafood', label: 'Seafood', color: '#4ECDC4' },
    { id: 'noodles', label: 'Noodles', color: '#C49000' },
    { id: 'meat', label: 'Meat', color: '#E88D67' },
    { id: 'vegetables', label: 'Vegetables', color: '#a3db33' },
    { id: 'dry-goods', label: 'Dry Goods', color: '#C4A882' },
    { id: 'condiments', label: 'Condiments', color: '#FF6B9D' },
    { id: 'cleaning', label: 'Cleaning', color: '#A855F7' },
  ],

  vouchers: [
    { id: 'VCH001', code: 'OD-2603-001', amount: 10.00, usedDate: '2026-03-02', claimed: false, claimMonth: '2026-03' },
    { id: 'VCH002', code: 'OD-2603-002', amount: 10.00, usedDate: '2026-03-03', claimed: false, claimMonth: '2026-03' },
    { id: 'VCH003', code: 'OD-2603-003', amount: 5.00, usedDate: '2026-03-04', claimed: false, claimMonth: '2026-03' },
    { id: 'VCH004', code: 'OD-2603-004', amount: 10.00, usedDate: '2026-03-05', claimed: true, claimMonth: '2026-03' },
    { id: 'VCH005', code: 'OD-2602-015', amount: 10.00, usedDate: '2026-02-20', claimed: true, claimMonth: '2026-02' },
    { id: 'VCH006', code: 'OD-2602-016', amount: 5.00, usedDate: '2026-02-22', claimed: true, claimMonth: '2026-02' },
  ],

  leaveRequests: [
    { id: 'LR001', employeeId: 'EMP004', type: 'annual', startDate: '2026-03-12', endDate: '2026-03-14', days: 3, reason: 'Family event', status: 'pending', appliedDate: '2026-03-06' },
    { id: 'LR002', employeeId: 'EMP002', type: 'medical', startDate: '2026-03-10', endDate: '2026-03-10', days: 1, reason: 'Dental appointment', status: 'pending', appliedDate: '2026-03-07' },
  ],

  stockAdjustments: [
    { id: 'ADJ001', itemId: 'STK002', type: 'delivery', qty: 4, notes: 'Regular order from Leong Guan', date: '2026-03-06', by: 'EMP001' },
    { id: 'ADJ002', itemId: 'STK009', type: 'waste', qty: -1, notes: 'Spoiled — left out overnight', date: '2026-03-05', by: 'EMP002' },
  ],

  dailySales: [
    { date: '2026-02-01', revenue: 1102.50, transactions: 59 },
    { date: '2026-02-02', revenue: 1280.30, transactions: 67 },
    { date: '2026-02-03', revenue: 945.70, transactions: 49 },
    { date: '2026-02-04', revenue: 1198.40, transactions: 63 },
    { date: '2026-02-05', revenue: 1345.60, transactions: 72 },
    { date: '2026-02-06', revenue: 1412.80, transactions: 76 },
    { date: '2026-02-07', revenue: 1230.90, transactions: 66 },
    { date: '2026-02-08', revenue: 1087.20, transactions: 58 },
    { date: '2026-02-09', revenue: 1356.40, transactions: 73 },
    { date: '2026-02-10', revenue: 998.80, transactions: 53 },
    { date: '2026-02-11', revenue: 1145.30, transactions: 60 },
    { date: '2026-02-12', revenue: 1389.70, transactions: 75 },
    { date: '2026-02-13', revenue: 1478.50, transactions: 80 },
    { date: '2026-02-14', revenue: 1623.40, transactions: 88 },
    { date: '2026-02-15', revenue: 1189.60, transactions: 64 },
    { date: '2026-02-16', revenue: 1267.80, transactions: 68 },
    { date: '2026-02-17', revenue: 934.20, transactions: 50 },
    { date: '2026-02-18', revenue: 1156.90, transactions: 62 },
    { date: '2026-02-19', revenue: 1298.40, transactions: 70 },
    { date: '2026-02-20', revenue: 1445.70, transactions: 78 },
    { date: '2026-02-21', revenue: 1367.30, transactions: 74 },
    { date: '2026-02-22', revenue: 1123.50, transactions: 60 },
    { date: '2026-02-23', revenue: 1289.80, transactions: 69 },
    { date: '2026-02-24', revenue: 978.40, transactions: 52 },
    { date: '2026-02-25', revenue: 1167.20, transactions: 63 },
    { date: '2026-02-26', revenue: 1334.60, transactions: 72 },
    { date: '2026-02-27', revenue: 1456.90, transactions: 79 },
    { date: '2026-02-28', revenue: 1312.70, transactions: 71 },
    { date: '2026-03-01', revenue: 1245.80, transactions: 68 },
    { date: '2026-03-02', revenue: 1389.20, transactions: 74 },
    { date: '2026-03-03', revenue: 987.50, transactions: 52 },
    { date: '2026-03-04', revenue: 1156.30, transactions: 61 },
    { date: '2026-03-05', revenue: 1423.70, transactions: 78 },
    { date: '2026-03-06', revenue: 1567.90, transactions: 85 },
    { date: '2026-03-07', revenue: 1312.40, transactions: 71 },
  ],
};
