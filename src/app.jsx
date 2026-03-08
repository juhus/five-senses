const {useState, useEffect, useRef, useCallback} = React;

// ─── Lucide Icon Wrapper ───
// Converts kebab-case name to PascalCase for Lucide's export format
function toPascal(s) { return s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase()); }

function createIcon(name) {
  const pascalName = toPascal(name);
  return function I({size = 20, color = 'currentColor', style = {}}) {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      const iconDef = lucide[pascalName] || (lucide.icons && lucide.icons[name]);
      if (!iconDef) return;
      while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
      const el = lucide.createElement(iconDef);
      el.setAttribute('width', size);
      el.setAttribute('height', size);
      el.setAttribute('stroke', color);
      el.setAttribute('stroke-width', '2');
      ref.current.appendChild(el);
    }, [size, color]);
    return <span ref={ref} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, ...style}} />;
  };
}

const Icon = {
  Home: createIcon('home'),
  Receipt: createIcon('receipt'),
  Users: createIcon('users'),
  Package: createIcon('package'),
  BarChart3: createIcon('bar-chart-3'),
  Wallet: createIcon('wallet'),
  FileText: createIcon('file-text'),
  TrendingUp: createIcon('trending-up'),
  TrendingDown: createIcon('trending-down'),
  Upload: createIcon('upload'),
  Camera: createIcon('camera'),
  PenLine: createIcon('pen-line'),
  Search: createIcon('search'),
  Bell: createIcon('bell'),
  Sparkles: createIcon('sparkles'),
  Clock: createIcon('clock'),
  CirclePlus: createIcon('circle-plus'),
  ChevronRight: createIcon('chevron-right'),
  ChevronLeft: createIcon('chevron-left'),
  AlertTriangle: createIcon('triangle-alert'),
  DollarSign: createIcon('dollar-sign'),
  Ticket: createIcon('ticket'),
  X: createIcon('x'),
  Check: createIcon('check'),
  Calendar: createIcon('calendar'),
  Plus: createIcon('plus'),
  Minus: createIcon('minus'),
  Edit: createIcon('pencil'),
  Trash: createIcon('trash-2'),
  Save: createIcon('save'),
  ArrowLeft: createIcon('arrow-left'),
  CreditCard: createIcon('credit-card'),
};

// ─── Helpers ───
function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function fmtDate(d) { return new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'}); }
function catColor(cat) { return DB.categories.find(c => c.id === cat)?.color || 'var(--muted)'; }
function getSupplier(id) { return DB.suppliers.find(s => s.id === id); }
function getEmployee(id, staff) { return staff.find(s => s.id === id); }
function genId(prefix) { return prefix + Date.now().toString(36).toUpperCase(); }

// ─── Infrastructure Components ───

function Modal({isOpen, onClose, title, children}) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h2 style={{fontSize: 18, fontWeight: 700}}>{title}</h2>
          <button onClick={onClose} style={{background: 'var(--surface2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
            <Icon.X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({isOpen, onClose, onConfirm, title, message}) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{maxHeight: 'auto', borderRadius: 'var(--radius)'}}>
        <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 8}}>{title}</h3>
        <p style={{fontSize: 13, color: 'var(--muted)', marginBottom: 24}}>{message}</p>
        <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
          <PillButton onClick={onClose} bg="var(--surface2)">Cancel</PillButton>
          <PillButton onClick={() => { onConfirm(); onClose(); }} bg="var(--accent)">Confirm</PillButton>
        </div>
      </div>
    </div>
  );
}

function Toast({toasts}) {
  if (toasts.length === 0) return null;
  const t = toasts[toasts.length - 1];
  return (
    <div className={`toast toast-${t.type || 'success'} ${t.exiting ? 'toast-exit' : ''}`}>
      {t.msg}
    </div>
  );
}

function FormField({label, children, style = {}}) {
  return (
    <div style={{marginBottom: 14, ...style}}>
      <label style={{display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 5}}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid var(--surface2)',
  borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--surface)',
  fontFamily: 'var(--font)', color: 'var(--text)', transition: 'border-color .15s ease',
};

// ─── Reusable Components ───

function Card({children, style = {}, onClick}) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        boxShadow: hover && onClick ? '0 8px 30px rgba(0,0,0,.08)' : 'var(--shadow)',
        padding: 20, transition: 'all .2s ease',
        transform: hover && onClick ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default', ...style,
      }}>
      {children}
    </div>
  );
}

function Pill({children, bg = 'var(--accent)', color = 'var(--text)', style = {}}) {
  return (
    <span style={{
      background: bg, color, borderRadius: 'var(--pill)',
      padding: '4px 14px', fontSize: 11, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 4, ...style,
    }}>
      {children}
    </span>
  );
}

function PillButton({children, icon: I, bg = 'var(--accent)', color = 'var(--text)', onClick, style = {}}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
      style={{
        background: bg, color, border: 'none', borderRadius: 'var(--pill)',
        padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7,
        boxShadow: pressed ? 'none' : '0 2px 8px rgba(0,0,0,.08)',
        transform: pressed ? 'scale(.97)' : 'none',
        transition: 'all .1s ease', fontFamily: 'var(--font)', ...style,
      }}>
      {I && <I size={15} color={color} />}
      {children}
    </button>
  );
}

function StatCard({label, value, trend}) {
  return (
    <Card style={{flex: 1, minWidth: 150}}>
      <div style={{fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 6}}>{label}</div>
      <div style={{fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
      {trend && (
        <div style={{fontSize: 10, fontWeight: 600, color: trend.startsWith('+') ? '#16a34a' : 'var(--accent2)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 3}}>
          {trend.startsWith('+') ? <Icon.TrendingUp size={12} color="#16a34a" /> : <Icon.TrendingDown size={12} color="var(--accent2)" />}
          {trend}
        </div>
      )}
    </Card>
  );
}

function SearchBar({value, onChange, placeholder = 'Search...'}) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow)', padding: '10px 16px'}}>
      <Icon.Search size={16} color="var(--muted)" />
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{border: 'none', outline: 'none', fontSize: 14, background: 'transparent', width: '100%', color: 'var(--text)'}} />
    </div>
  );
}

function SectionHeader({title, action, onAction}) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
      <h2 style={{fontSize: 18, fontWeight: 700}}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)'}}>
          {action} <Icon.ChevronRight size={14} color="var(--accent)" />
        </button>
      )}
    </div>
  );
}

function EmptyState({message, icon: I = Icon.Package}) {
  return (
    <div style={{textAlign: 'center', padding: 40}}>
      <I size={32} color="var(--muted)" style={{marginBottom: 8}} />
      <p style={{fontSize: 13, color: 'var(--muted)'}}>{message}</p>
    </div>
  );
}

function BackButton({onClick, label = 'Back'}) {
  return (
    <button onClick={onClick} style={{display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 16, fontFamily: 'var(--font)', padding: 0}}>
      <Icon.ArrowLeft size={16} color="var(--muted)" /> {label}
    </button>
  );
}

function TabBar({tabs, active, onChange}) {
  return (
    <div style={{display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface2)', borderRadius: 'var(--pill)', padding: 3}}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: '8px 16px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
          borderRadius: 'var(--pill)', background: active === t.id ? 'var(--surface)' : 'transparent',
          boxShadow: active === t.id ? 'var(--shadow)' : 'none', color: 'var(--text)', transition: 'all .2s ease',
          fontFamily: 'var(--font)',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ══════════════════════════════
// ── PAGE: HOME ──
// ══════════════════════════════
function HomePage({invoices, staff, inventory, goTo, openModal, timesheets, leaveRequests}) {
  const [showNotif, setShowNotif] = useState(false);
  const totalExpenses = invoices.reduce((s, i) => s + i.total, 0);
  const pendingCount = invoices.filter(i => i.status === 'pending').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  const marchSales = DB.dailySales.filter(d => d.date.startsWith('2026-03'));
  const todaySales = marchSales[marchSales.length - 1];
  const yesterdaySales = marchSales[marchSales.length - 2];
  const salesTrend = ((todaySales.revenue - yesterdaySales.revenue) / yesterdaySales.revenue * 100).toFixed(1);
  const lowStock = inventory.filter(i => i.currentStock <= i.minStock);
  const staffOnDuty = staff.filter(s => s.type === 'full-time').length + timesheets.filter(t => t.date === '2026-03-07').length;
  const pendingLeave = leaveRequests.filter(l => l.status === 'pending');
  const expiringItems = inventory.filter(i => {
    const daysSince = Math.floor((new Date('2026-03-08') - new Date(i.lastOrdered)) / 86400000);
    return i.shelfLife - daysSince <= 7 && i.shelfLife - daysSince > 0;
  });
  const notifCount = overdueCount + pendingLeave.length + expiringItems.length;

  return (
    <div className="page-enter">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
        <div>
          <h1 style={{fontSize: 22, fontWeight: 700}}>Good morning, Shaun</h1>
          <p style={{fontSize: 12, color: 'var(--muted)'}}>Five Senses Cafe — {new Date().toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'short'})}</p>
        </div>
        <div onClick={() => setShowNotif(!showNotif)} style={{background: notifCount > 0 ? 'var(--accent2)' : 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: notifCount > 0 ? '#fff' : 'var(--text)', position: 'relative'}}>
          <Icon.Bell size={14} color={notifCount > 0 ? '#fff' : 'var(--text)'} /> {notifCount}
        </div>
      </div>

      {/* Notification Overlay */}
      {showNotif && (
        <Card style={{marginBottom: 20, border: '2px solid var(--accent2)22'}}>
          <div style={{fontSize: 14, fontWeight: 700, marginBottom: 12}}>Notifications</div>
          {overdueCount > 0 && <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--surface2)', fontSize: 12}}>
            <Icon.AlertTriangle size={14} color="var(--accent2)" /> <span><b>{overdueCount}</b> overdue invoice{overdueCount > 1 ? 's' : ''}</span>
            <button onClick={() => { setShowNotif(false); goTo('expenses'); }} style={{marginLeft: 'auto', background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font)'}}>View</button>
          </div>}
          {pendingLeave.length > 0 && <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--surface2)', fontSize: 12}}>
            <Icon.Calendar size={14} color="#4ECDC4" /> <span><b>{pendingLeave.length}</b> pending leave request{pendingLeave.length > 1 ? 's' : ''}</span>
            <button onClick={() => { setShowNotif(false); goTo('hr', 'leave'); }} style={{marginLeft: 'auto', background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font)'}}>View</button>
          </div>}
          {expiringItems.length > 0 && <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 12}}>
            <Icon.Clock size={14} color="#C49000" /> <span><b>{expiringItems.length}</b> item{expiringItems.length > 1 ? 's' : ''} near expiry</span>
            <button onClick={() => { setShowNotif(false); goTo('inventory'); }} style={{marginLeft: 'auto', background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font)'}}>View</button>
          </div>}
          {notifCount === 0 && <p style={{fontSize: 12, color: 'var(--muted)'}}>All clear!</p>}
        </Card>
      )}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, marginBottom: 28}}>
        <StatCard label="Today's Revenue" value={fmt(todaySales.revenue)} trend={`${salesTrend > 0 ? '+' : ''}${salesTrend}%`} />
        <StatCard label="Week Expenses" value={fmt(totalExpenses)} />
        <StatCard label="Pending / Overdue" value={`${pendingCount} / ${overdueCount}`} />
        <StatCard label="Staff Today" value={staffOnDuty} trend="Full crew" />
      </div>

      <SectionHeader title="Quick Actions" />
      <div style={{display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap'}}>
        <PillButton icon={Icon.Upload} bg="var(--accent)" onClick={() => openModal('upload')}>Upload Receipt</PillButton>
        <PillButton icon={Icon.PenLine} bg="var(--surface2)" onClick={() => openModal('manualEntry')}>Manual Entry</PillButton>
        <PillButton icon={Icon.Clock} bg="var(--surface2)" onClick={() => goTo('hr', 'timesheets')}>Clock In</PillButton>
      </div>

      {lowStock.length > 0 && <>
        <SectionHeader title="Low Stock Alerts" action={`${lowStock.length} items`} onAction={() => goTo('inventory')} />
        <div style={{display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 28}}>
          {lowStock.map(item => (
            <Card key={item.id} style={{minWidth: 160, flex: '0 0 auto'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                <div style={{background: catColor(item.category) + '22', borderRadius: 10, padding: 6, display: 'flex'}}>
                  <Icon.AlertTriangle size={14} color={catColor(item.category)} />
                </div>
                <Pill bg={catColor(item.category) + '22'} color={catColor(item.category)} style={{fontSize: 9}}>{item.category}</Pill>
              </div>
              <div style={{fontSize: 13, fontWeight: 700, marginBottom: 2}}>{item.name}</div>
              <div style={{fontSize: 11, color: 'var(--muted)'}}>{item.currentStock} / {item.minStock} {item.unit}</div>
            </Card>
          ))}
        </div>
      </>}

      <SectionHeader title="Recent Invoices" action="View all" onAction={() => goTo('expenses')} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28}}>
        {invoices.slice(0, 4).map(inv => {
          const sup = getSupplier(inv.supplierId);
          const statusColors = {paid: 'var(--accent)', pending: 'var(--surface2)', overdue: 'var(--accent2)'};
          const statusTextColors = {paid: 'var(--text)', pending: 'var(--text)', overdue: '#fff'};
          return (
            <Card key={inv.id} onClick={() => goTo('expenses', 'detail', inv.id)} style={{padding: '14px 18px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, flex: 1}}>
                  <div style={{background: 'var(--accent)22', borderRadius: 'var(--radius-sm)', padding: 8, display: 'flex'}}>
                    <Icon.FileText size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 13}}>{sup?.shortName}</div>
                    <div style={{fontSize: 10, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums'}}>{inv.items.length} item{inv.items.length > 1 ? 's' : ''} — {fmtDate(inv.date)}</div>
                  </div>
                </div>
                <div style={{fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.total)}</div>
                <Pill bg={statusColors[inv.status]} color={statusTextColors[inv.status]}>{inv.status.toUpperCase()}</Pill>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionHeader title="This Week's Revenue" />
      <Card style={{marginBottom: 28}}>
        {(() => {
          const max = Math.max(...marchSales.map(x => x.revenue));
          const barMaxH = 60;
          return (
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 6}}>
              {marchSales.map((d, i) => {
                const barH = Math.round((d.revenue / max) * barMaxH);
                const isToday = i === marchSales.length - 1;
                return (
                  <div key={d.date} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                    <div style={{fontSize: 9, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: isToday ? 'var(--text)' : 'var(--muted)'}}>
                      {fmt(d.revenue).replace('$', '')}
                    </div>
                    <div style={{width: '100%', height: barH, minHeight: 4, borderRadius: 8, background: isToday ? 'var(--accent)' : 'var(--surface2)', transition: 'height .3s ease'}} />
                    <div style={{fontSize: 9, fontWeight: 600, color: 'var(--muted)'}}>
                      {new Date(d.date).toLocaleDateString('en-GB', {weekday: 'short'})}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Card>
    </div>
  );
}

// ══════════════════════════════
// ── INVOICE DETAIL VIEW ──
// ══════════════════════════════
function InvoiceDetailView({invoiceId, invoices, onBack, onMarkPaid, addToast}) {
  const inv = invoices.find(i => i.id === invoiceId);
  const [showConfirm, setShowConfirm] = useState(false);
  if (!inv) return <div className="page-enter"><BackButton onClick={onBack} /><EmptyState message="Invoice not found" icon={Icon.FileText} /></div>;
  const sup = getSupplier(inv.supplierId);
  const statusBg = {paid: 'var(--accent)', pending: 'var(--surface2)', overdue: 'var(--accent2)'}[inv.status];
  const statusColor = inv.status === 'overdue' ? '#fff' : 'var(--text)';

  return (
    <div className="page-enter">
      <BackButton onClick={onBack} label="Back to Expenses" />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20}}>
        <div>
          <h1 style={{fontSize: 20, fontWeight: 700}}>{sup?.shortName}</h1>
          <p style={{fontSize: 12, color: 'var(--muted)'}}>{inv.invoiceNo} — {fmtDate(inv.date)}</p>
        </div>
        <Pill bg={statusBg} color={statusColor} style={{fontSize: 11}}>{inv.status.toUpperCase()}</Pill>
      </div>

      <Card style={{marginBottom: 16}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12}}>
          <div><span style={{color: 'var(--muted)'}}>Supplier</span><div style={{fontWeight: 600, marginTop: 2}}>{sup?.name}</div></div>
          <div><span style={{color: 'var(--muted)'}}>Terms</span><div style={{fontWeight: 600, marginTop: 2}}>{inv.terms}</div></div>
          <div><span style={{color: 'var(--muted)'}}>Due Date</span><div style={{fontWeight: 600, marginTop: 2}}>{fmtDate(inv.dueDate)}</div></div>
          {sup?.agent && <div><span style={{color: 'var(--muted)'}}>Agent</span><div style={{fontWeight: 600, marginTop: 2}}>{sup.agent}</div></div>}
        </div>
      </Card>

      <SectionHeader title="Line Items" />
      <Card style={{marginBottom: 16, padding: 0, overflow: 'hidden'}}>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12}}>
            <thead>
              <tr style={{background: 'var(--surface2)'}}>
                <th style={{textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: 'var(--muted)', fontSize: 10}}>Item</th>
                <th style={{textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: 'var(--muted)', fontSize: 10}}>Qty</th>
                <th style={{textAlign: 'right', padding: '10px 8px', fontWeight: 600, color: 'var(--muted)', fontSize: 10}}>Price</th>
                <th style={{textAlign: 'right', padding: '10px 14px', fontWeight: 600, color: 'var(--muted)', fontSize: 10}}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i} style={{borderTop: '1px solid var(--surface2)'}}>
                  <td style={{padding: '10px 14px'}}>
                    <div style={{fontWeight: 600}}>{item.description}</div>
                    {item.packSize && <div style={{fontSize: 10, color: 'var(--muted)'}}>{item.packSize}</div>}
                  </td>
                  <td style={{textAlign: 'center', padding: '10px 8px', fontVariantNumeric: 'tabular-nums'}}>{item.qty} {item.uom}</td>
                  <td style={{textAlign: 'right', padding: '10px 8px', fontVariantNumeric: 'tabular-nums'}}>{fmt(item.unitPrice)}</td>
                  <td style={{textAlign: 'right', padding: '10px 14px', fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{borderTop: '2px solid var(--surface2)', padding: '12px 14px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4}}>
            <span style={{color: 'var(--muted)'}}>Subtotal</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.subtotal)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8}}>
            <span style={{color: 'var(--muted)'}}>GST (9%)</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.gst)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700}}>
            <span>Total</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.total)}</span>
          </div>
        </div>
      </Card>

      {inv.status !== 'paid' && (
        <PillButton icon={Icon.CreditCard} bg="var(--accent)" onClick={() => setShowConfirm(true)} style={{width: '100%', justifyContent: 'center', padding: '14px 22px'}}>
          Mark as Paid
        </PillButton>
      )}

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)}
        title="Mark as Paid?" message={`Confirm payment of ${fmt(inv.total)} to ${sup?.shortName}?`}
        onConfirm={() => { onMarkPaid(inv.id); addToast('Invoice marked as paid', 'success'); }} />
    </div>
  );
}

// ══════════════════════════════
// ── MANUAL ENTRY FORM ──
// ══════════════════════════════
function ManualEntryForm({isOpen, onClose, onSave}) {
  const [supplier, setSupplier] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('2026-03-08');
  const [terms, setTerms] = useState('CASH');
  const [items, setItems] = useState([{description: '', qty: 1, uom: 'PKT', unitPrice: 0, category: 'dry-goods'}]);

  function addItem() { setItems([...items, {description: '', qty: 1, uom: 'PKT', unitPrice: 0, category: 'dry-goods'}]); }
  function removeItem(i) { if (items.length > 1) setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i, field, val) { const next = [...items]; next[i] = {...next[i], [field]: val}; setItems(next); }

  const subtotal = items.reduce((s, it) => s + (it.qty * it.unitPrice), 0);
  const gst = Math.round(subtotal * 0.09 * 100) / 100;
  const total = subtotal + gst;

  function handleSave() {
    if (!supplier || !invoiceNo || items.some(it => !it.description)) return;
    const dueMap = {'CASH': 0, 'COD': 0, 'Net 7 days': 7, 'Net 14 days': 14, '30 Days': 30};
    const dueDays = dueMap[terms] || 0;
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + dueDays);
    onSave({
      id: genId('INV'), supplierId: supplier, invoiceNo, date, terms, status: 'pending',
      dueDate: dueDate.toISOString().split('T')[0],
      subtotal, gst, total,
      items: items.map(it => ({...it, amount: it.qty * it.unitPrice})),
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Invoice Entry">
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
        <FormField label="Supplier">
          <select value={supplier} onChange={e => setSupplier(e.target.value)} style={inputStyle}>
            <option value="">Select...</option>
            {DB.suppliers.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
          </select>
        </FormField>
        <FormField label="Invoice No.">
          <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} style={inputStyle} placeholder="e.g. INV-001" />
        </FormField>
        <FormField label="Date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Terms">
          <select value={terms} onChange={e => setTerms(e.target.value)} style={inputStyle}>
            {['CASH', 'COD', 'Net 7 days', 'Net 14 days', '30 Days'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
      </div>

      <div style={{fontSize: 14, fontWeight: 700, margin: '16px 0 10px'}}>Line Items</div>
      {items.map((item, i) => (
        <Card key={i} style={{padding: 12, marginBottom: 8, background: 'var(--surface2)'}}>
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end'}}>
            <FormField label="Description" style={{flex: 2, minWidth: 140, marginBottom: 0}}>
              <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}} />
            </FormField>
            <FormField label="Qty" style={{flex: 0, minWidth: 60, marginBottom: 0}}>
              <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', +e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}} />
            </FormField>
            <FormField label="Price" style={{flex: 0, minWidth: 80, marginBottom: 0}}>
              <input type="number" step="0.01" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', +e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}} />
            </FormField>
            <FormField label="Category" style={{flex: 1, minWidth: 100, marginBottom: 0}}>
              <select value={item.category} onChange={e => updateItem(i, 'category', e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}}>
                {DB.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </FormField>
            <button onClick={() => removeItem(i)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 4}}>
              <Icon.Trash size={14} color="var(--accent2)" />
            </button>
          </div>
          <div style={{textAlign: 'right', fontSize: 12, fontWeight: 600, marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>
            = {fmt(item.qty * item.unitPrice)}
          </div>
        </Card>
      ))}
      <button onClick={addItem} style={{background: 'none', border: '2px dashed var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '10px', width: '100%', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', marginBottom: 16, fontFamily: 'var(--font)'}}>
        + Add line item
      </button>

      <div style={{background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: 14, marginBottom: 16}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4}}>
          <span>Subtotal</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(subtotal)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4}}>
          <span>GST (9%)</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(gst)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700}}>
          <span>Total</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(total)}</span>
        </div>
      </div>

      <PillButton icon={Icon.Save} bg="var(--accent)" onClick={handleSave} style={{width: '100%', justifyContent: 'center'}}>
        Save Invoice
      </PillButton>
    </Modal>
  );
}

// ══════════════════════════════
// ── UPLOAD AREA ──
// ══════════════════════════════
function UploadAreaModal({isOpen, onClose, onOpenManual}) {
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  function handleDrop() {
    setDragging(false);
    setScanning(true);
    setTimeout(() => { setScanning(false); setDone(true); }, 1500);
  }

  function handleContinue() {
    setDone(false);
    onClose();
    onOpenManual();
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setDone(false); setScanning(false); }} title="Upload Receipt">
      {!scanning && !done && (
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); handleDrop(); }} onClick={handleDrop}
          style={{
            border: `3px dashed ${dragging ? 'var(--accent)' : 'var(--surface2)'}`, borderRadius: 'var(--radius)',
            padding: 50, textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--accent)11' : 'transparent',
            transition: 'all .2s ease',
          }}>
          <Icon.Upload size={36} color="var(--muted)" style={{marginBottom: 12}} />
          <p style={{fontSize: 14, fontWeight: 600, marginBottom: 4}}>Drop receipt here</p>
          <p style={{fontSize: 11, color: 'var(--muted)'}}>or click to browse files</p>
        </div>
      )}
      {scanning && (
        <div style={{textAlign: 'center', padding: 50}}>
          <Icon.Sparkles size={36} color="var(--accent)" style={{marginBottom: 12}} />
          <p style={{fontSize: 14, fontWeight: 600}}>Scanning receipt...</p>
          <div style={{width: 120, height: 4, background: 'var(--surface2)', borderRadius: 2, margin: '16px auto', overflow: 'hidden'}}>
            <div style={{width: '60%', height: '100%', background: 'var(--accent)', borderRadius: 2, animation: 'fadeIn .5s ease infinite alternate'}} />
          </div>
        </div>
      )}
      {done && (
        <div style={{textAlign: 'center', padding: 30}}>
          <Icon.Check size={36} color="var(--accent)" style={{marginBottom: 12}} />
          <p style={{fontSize: 14, fontWeight: 600, marginBottom: 4}}>Scan complete!</p>
          <p style={{fontSize: 12, color: 'var(--muted)', marginBottom: 20}}>Data extracted. Review and edit in the form.</p>
          <PillButton icon={Icon.PenLine} bg="var(--accent)" onClick={handleContinue}>Review & Edit</PillButton>
        </div>
      )}
    </Modal>
  );
}

// ══════════════════════════════
// ── PAGE: EXPENSES ──
// ══════════════════════════════
function ExpensesPage({invoices, goTo, openModal}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const overdue = invoices.filter(i => i.status === 'overdue');
  const almostDue = invoices.filter(i => {
    if (i.status !== 'pending') return false;
    const daysLeft = Math.floor((new Date(i.dueDate) - new Date('2026-03-08')) / 86400000);
    return daysLeft <= 3 && daysLeft >= 0;
  });

  const filtered = invoices.filter(inv => {
    const sup = getSupplier(inv.supplierId);
    const matchSearch = !search || sup?.shortName.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || inv.status === filter;
    return matchSearch && matchFilter;
  });
  const totalAmount = filtered.reduce((s, i) => s + i.total, 0);

  return (
    <div className="page-enter">
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20}}>
        <h1 style={{fontSize: 20, fontWeight: 700, flex: 1}}>Expenses</h1>
        <PillButton icon={Icon.Upload} bg="var(--surface2)" onClick={() => openModal('upload')} style={{padding: '8px 16px', fontSize: 12}}>Upload</PillButton>
        <PillButton icon={Icon.CirclePlus} bg="var(--accent)" onClick={() => openModal('manualEntry')}>Add</PillButton>
      </div>

      {/* Payment Due Alerts */}
      {(overdue.length > 0 || almostDue.length > 0) && (
        <Card style={{marginBottom: 16, padding: '14px 18px', background: 'var(--accent2)08', border: '1px solid var(--accent2)22'}}>
          <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6}}>
            <Icon.AlertTriangle size={14} color="var(--accent2)" /> Payment Alerts
          </div>
          {overdue.map(inv => (
            <div key={inv.id} onClick={() => goTo('expenses', 'detail', inv.id)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', cursor: 'pointer', fontSize: 12}}>
              <span><Pill bg="var(--accent2)" color="#fff" style={{fontSize: 9, marginRight: 6}}>OVERDUE</Pill>{getSupplier(inv.supplierId)?.shortName}</span>
              <span style={{fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.total)}</span>
            </div>
          ))}
          {almostDue.map(inv => (
            <div key={inv.id} onClick={() => goTo('expenses', 'detail', inv.id)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', cursor: 'pointer', fontSize: 12}}>
              <span><Pill bg="#C4900022" color="#B8860B" style={{fontSize: 9, marginRight: 6}}>DUE SOON</Pill>{getSupplier(inv.supplierId)?.shortName}</span>
              <span style={{fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.total)}</span>
            </div>
          ))}
        </Card>
      )}

      <SearchBar value={search} onChange={setSearch} placeholder="Search suppliers, invoices..." />

      <div style={{display: 'flex', gap: 6, margin: '14px 0 18px', flexWrap: 'wrap'}}>
        {['all', 'paid', 'pending', 'overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
            borderRadius: 'var(--pill)', background: filter === f ? 'var(--accent)' : 'var(--surface2)',
            color: 'var(--text)', transition: 'all .15s ease', fontFamily: 'var(--font)',
          }}>{f.toUpperCase()} ({f === 'all' ? invoices.length : invoices.filter(i => i.status === f).length})</button>
        ))}
      </div>

      <Card style={{marginBottom: 18, padding: '14px 18px', background: 'var(--accent)11'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 12, color: 'var(--muted)', fontWeight: 600}}>{filtered.length} invoice{filtered.length !== 1 ? 's' : ''}</div>
          <div style={{fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(totalAmount)}</div>
        </div>
      </Card>

      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {filtered.length === 0 && <EmptyState message="No invoices match your search" icon={Icon.FileText} />}
        {filtered.map(inv => {
          const sup = getSupplier(inv.supplierId);
          const statusBg = {paid: 'var(--accent)', pending: 'var(--surface2)', overdue: 'var(--accent2)'}[inv.status];
          const statusColor = inv.status === 'overdue' ? '#fff' : 'var(--text)';
          return (
            <Card key={inv.id} style={{padding: 0, overflow: 'hidden'}} onClick={() => goTo('expenses', 'detail', inv.id)}>
              <div style={{padding: '14px 18px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <div style={{background: 'var(--accent)22', borderRadius: 12, padding: 8, display: 'flex'}}>
                      <Icon.FileText size={16} color="var(--accent)" />
                    </div>
                    <div>
                      <div style={{fontWeight: 700, fontSize: 14}}>{sup?.shortName}</div>
                      <div style={{fontSize: 10, color: 'var(--muted)'}}>{inv.invoiceNo} — {fmtDate(inv.date)}</div>
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums'}}>{fmt(inv.total)}</div>
                    <Pill bg={statusBg} color={statusColor} style={{fontSize: 9}}>{inv.status.toUpperCase()}</Pill>
                  </div>
                </div>
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                  {inv.items.map((item, i) => (
                    <Pill key={i} bg={catColor(item.category) + '22'} color={catColor(item.category)} style={{fontSize: 9}}>
                      {item.description.split('(')[0].trim().substring(0, 25)}
                    </Pill>
                  ))}
                </div>
              </div>
              <div style={{background: 'var(--surface2)', padding: '8px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)'}}>
                <span>Terms: {inv.terms}</span>
                <span>Due: {fmtDate(inv.dueDate)}</span>
                <span>GST: {fmt(inv.gst)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════
// ── HR FORMS ──
// ══════════════════════════════
function StaffForm({isOpen, onClose, onSave, editStaff}) {
  const [name, setName] = useState(editStaff?.name || '');
  const [role, setRole] = useState(editStaff?.role || '');
  const [type, setType] = useState(editStaff?.type || 'full-time');
  const [salary, setSalary] = useState(editStaff?.salary || '');
  const [hourlyRate, setHourlyRate] = useState(editStaff?.hourlyRate || '');
  const [hoursWeek, setHoursWeek] = useState(editStaff?.hoursWeek || '');

  useEffect(() => {
    if (editStaff) { setName(editStaff.name); setRole(editStaff.role); setType(editStaff.type); setSalary(editStaff.salary || ''); setHourlyRate(editStaff.hourlyRate || ''); setHoursWeek(editStaff.hoursWeek || ''); }
    else { setName(''); setRole(''); setType('full-time'); setSalary(''); setHourlyRate(''); setHoursWeek(''); }
  }, [editStaff, isOpen]);

  function handleSave() {
    if (!name || !role) return;
    onSave({
      id: editStaff?.id || genId('EMP'), name, role, type,
      salary: type === 'full-time' ? +salary : undefined,
      hourlyRate: type === 'part-time' ? +hourlyRate : undefined,
      hoursWeek: type === 'part-time' ? +hoursWeek : undefined,
      cpf: type === 'full-time', leaveEntitlement: type === 'full-time' ? 14 : 7, leaveUsed: editStaff?.leaveUsed || 0,
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editStaff ? 'Edit Staff' : 'Add Staff'}>
      <FormField label="Full Name"><input value={name} onChange={e => setName(e.target.value)} style={inputStyle} /></FormField>
      <FormField label="Role"><input value={role} onChange={e => setRole(e.target.value)} style={inputStyle} /></FormField>
      <FormField label="Type">
        <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
      </FormField>
      {type === 'full-time' ? (
        <FormField label="Monthly Salary ($)"><input type="number" value={salary} onChange={e => setSalary(e.target.value)} style={inputStyle} /></FormField>
      ) : (<>
        <FormField label="Hourly Rate ($)"><input type="number" step="0.5" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} style={inputStyle} /></FormField>
        <FormField label="Hours/Week"><input type="number" value={hoursWeek} onChange={e => setHoursWeek(e.target.value)} style={inputStyle} /></FormField>
      </>)}
      <PillButton icon={Icon.Save} bg="var(--accent)" onClick={handleSave} style={{width: '100%', justifyContent: 'center', marginTop: 8}}>
        {editStaff ? 'Update' : 'Add'} Staff
      </PillButton>
    </Modal>
  );
}

function LeaveForm({isOpen, onClose, onSave, staff}) {
  const [empId, setEmpId] = useState('');
  const [type, setType] = useState('annual');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => { if (isOpen) { setEmpId(''); setType('annual'); setStart(''); setEnd(''); setReason(''); } }, [isOpen]);

  function handleSave() {
    if (!empId || !start || !end) return;
    const days = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
    onSave({ id: genId('LR'), employeeId: empId, type, startDate: start, endDate: end, days, reason, status: 'pending', appliedDate: '2026-03-08' });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <FormField label="Employee">
        <select value={empId} onChange={e => setEmpId(e.target.value)} style={inputStyle}>
          <option value="">Select...</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </FormField>
      <FormField label="Leave Type">
        <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
          <option value="annual">Annual Leave</option>
          <option value="medical">Medical Leave</option>
          <option value="unpaid">Unpaid Leave</option>
        </select>
      </FormField>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
        <FormField label="Start Date"><input type="date" value={start} onChange={e => setStart(e.target.value)} style={inputStyle} /></FormField>
        <FormField label="End Date"><input type="date" value={end} onChange={e => setEnd(e.target.value)} style={inputStyle} /></FormField>
      </div>
      <FormField label="Reason"><input value={reason} onChange={e => setReason(e.target.value)} style={inputStyle} placeholder="Optional" /></FormField>
      <PillButton icon={Icon.Save} bg="var(--accent)" onClick={handleSave} style={{width: '100%', justifyContent: 'center', marginTop: 8}}>Submit Leave</PillButton>
    </Modal>
  );
}

// ══════════════════════════════
// ── PAYSLIP VIEW ──
// ══════════════════════════════
function PayslipView({staff, timesheets}) {
  const [empId, setEmpId] = useState(staff[0]?.id || '');
  const [month, setMonth] = useState('2026-03');
  const emp = staff.find(s => s.id === empId);
  if (!emp) return <EmptyState message="Select an employee" icon={Icon.Users} />;

  const isFT = emp.type === 'full-time';
  const gross = isFT ? emp.salary : (() => {
    const monthTs = timesheets.filter(t => t.employeeId === empId && t.date.startsWith(month));
    const totalHours = monthTs.reduce((s, t) => s + t.hours, 0);
    return totalHours * (emp.hourlyRate || 0);
  })();
  const employeeCpf = emp.cpf ? Math.round(gross * 0.20 * 100) / 100 : 0;
  const employerCpf = emp.cpf ? Math.round(gross * 0.17 * 100) / 100 : 0;
  const net = gross - employeeCpf;

  return (
    <div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16}}>
        <FormField label="Employee">
          <select value={empId} onChange={e => setEmpId(e.target.value)} style={inputStyle}>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormField>
        <FormField label="Month">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={inputStyle} />
        </FormField>
      </div>
      <Card>
        <div style={{textAlign: 'center', marginBottom: 16}}>
          <div style={{fontSize: 11, color: 'var(--muted)', fontWeight: 600}}>Payslip — {emp.name}</div>
          <div style={{fontSize: 10, color: 'var(--muted)'}}>{emp.role} ({emp.type})</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface2)'}}>
            <span>Gross Pay</span><span style={{fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(gross)}</span>
          </div>
          {emp.cpf && <>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface2)'}}>
              <span style={{color: 'var(--muted)'}}>Employee CPF (20%)</span><span style={{fontVariantNumeric: 'tabular-nums', color: 'var(--accent2)'}}>-{fmt(employeeCpf)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface2)'}}>
              <span style={{color: 'var(--muted)'}}>Employer CPF (17%)</span><span style={{fontVariantNumeric: 'tabular-nums', color: 'var(--muted)'}}>{fmt(employerCpf)}</span>
            </div>
          </>}
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 18, fontWeight: 700}}>
            <span>Net Pay</span><span style={{fontVariantNumeric: 'tabular-nums', color: 'var(--accent)'}}>{fmt(net)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════
// ── PAGE: HR ──
// ══════════════════════════════
function HRPage({staff, timesheets, leaveRequests, setStaff, setLeaveRequests, addToast, openModal, initialTab}) {
  const [tab, setTab] = useState(initialTab || 'staff');
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  function saveStaff(emp) {
    setStaff(prev => {
      const exists = prev.find(s => s.id === emp.id);
      if (exists) return prev.map(s => s.id === emp.id ? emp : s);
      return [...prev, emp];
    });
    addToast(editStaff ? 'Staff updated' : 'Staff added', 'success');
    setEditStaff(null);
  }

  function saveLeave(lr) {
    setLeaveRequests(prev => [...prev, lr]);
    addToast('Leave request submitted', 'success');
  }

  function approveLeave(id) {
    const lr = leaveRequests.find(l => l.id === id);
    setLeaveRequests(prev => prev.map(l => l.id === id ? {...l, status: 'approved'} : l));
    if (lr) setStaff(prev => prev.map(s => s.id === lr.employeeId ? {...s, leaveUsed: s.leaveUsed + lr.days} : s));
    addToast('Leave approved', 'success');
  }

  function rejectLeave(id) {
    setLeaveRequests(prev => prev.map(l => l.id === id ? {...l, status: 'rejected'} : l));
    addToast('Leave rejected', 'info');
  }

  const tabs = [{id: 'staff', label: 'Staff'}, {id: 'timesheets', label: 'Timesheets'}, {id: 'leave', label: 'Leave'}, {id: 'payslips', label: 'Payslips'}];

  return (
    <div className="page-enter">
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20}}>
        <h1 style={{fontSize: 20, fontWeight: 700, flex: 1}}>HR & Payroll</h1>
        {tab === 'staff' && <PillButton icon={Icon.CirclePlus} bg="var(--accent)" onClick={() => { setEditStaff(null); setShowStaffForm(true); }}>Add</PillButton>}
        {tab === 'leave' && <PillButton icon={Icon.CirclePlus} bg="var(--accent)" onClick={() => setShowLeaveForm(true)}>Apply</PillButton>}
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'staff' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {staff.length === 0 && <EmptyState message="No staff added yet" icon={Icon.Users} />}
          {staff.map(emp => (
            <Card key={emp.id} style={{padding: '16px 18px'}} onClick={() => { setEditStaff(emp); setShowStaffForm(true); }}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: emp.type === 'full-time' ? 'var(--accent)22' : 'var(--accent2)22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700, color: emp.type === 'full-time' ? 'var(--accent)' : 'var(--accent2)',
                  }}>{emp.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 14}}>{emp.name}</div>
                    <div style={{fontSize: 11, color: 'var(--muted)'}}>{emp.role}</div>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums'}}>
                    {emp.salary ? fmt(emp.salary) : `$${emp.hourlyRate}/hr`}
                  </div>
                  <Pill bg={emp.type === 'full-time' ? 'var(--accent)22' : 'var(--accent2)22'}
                    color={emp.type === 'full-time' ? 'var(--accent)' : 'var(--accent2)'}
                    style={{fontSize: 9}}>{emp.type.toUpperCase()}</Pill>
                </div>
              </div>
              <div style={{display: 'flex', gap: 16, marginTop: 10, fontSize: 10, color: 'var(--muted)'}}>
                <span>Leave: {emp.leaveUsed}/{emp.leaveEntitlement} days</span>
                {emp.cpf && <span>CPF: Yes</span>}
                {emp.hoursWeek && <span>{emp.hoursWeek} hrs/week</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'timesheets' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {timesheets.length === 0 && <EmptyState message="No timesheets recorded" icon={Icon.Clock} />}
          {timesheets.map((ts, i) => {
            const emp = getEmployee(ts.employeeId, staff);
            return (
              <Card key={i} style={{padding: '12px 18px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 13}}>{emp?.name || 'Unknown'}</div>
                    <div style={{fontSize: 10, color: 'var(--muted)'}}>{fmtDate(ts.date)} — {ts.clockIn} to {ts.clockOut}</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span style={{fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums'}}>{ts.hours}h</span>
                    <Pill bg={ts.status === 'approved' ? 'var(--accent)22' : 'var(--surface2)'}
                      color={ts.status === 'approved' ? 'var(--accent)' : 'var(--muted)'}
                      style={{fontSize: 9}}>{ts.status.toUpperCase()}</Pill>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'leave' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {leaveRequests.length === 0 && <EmptyState message="No leave requests" icon={Icon.Calendar} />}
          {leaveRequests.map(lr => {
            const emp = getEmployee(lr.employeeId, staff);
            const statusBg = {pending: 'var(--surface2)', approved: 'var(--accent)22', rejected: 'var(--accent2)22'}[lr.status];
            const statusColor = {pending: 'var(--muted)', approved: 'var(--accent)', rejected: 'var(--accent2)'}[lr.status];
            return (
              <Card key={lr.id} style={{padding: '14px 18px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 14}}>{emp?.name || 'Unknown'}</div>
                    <div style={{fontSize: 11, color: 'var(--muted)'}}>{lr.type} — {lr.days} day{lr.days > 1 ? 's' : ''}</div>
                    <div style={{fontSize: 10, color: 'var(--muted)', marginTop: 2}}>{fmtDate(lr.startDate)} to {fmtDate(lr.endDate)}</div>
                    {lr.reason && <div style={{fontSize: 10, color: 'var(--muted)', marginTop: 2, fontStyle: 'italic'}}>{lr.reason}</div>}
                  </div>
                  <Pill bg={statusBg} color={statusColor} style={{fontSize: 9}}>{lr.status.toUpperCase()}</Pill>
                </div>
                {lr.status === 'pending' && (
                  <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
                    <PillButton bg="var(--accent2)" color="#fff" onClick={() => rejectLeave(lr.id)} style={{padding: '6px 16px', fontSize: 11}}>Reject</PillButton>
                    <PillButton bg="var(--accent)" onClick={() => approveLeave(lr.id)} style={{padding: '6px 16px', fontSize: 11}}>Approve</PillButton>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'payslips' && <PayslipView staff={staff} timesheets={timesheets} />}

      <StaffForm isOpen={showStaffForm} onClose={() => { setShowStaffForm(false); setEditStaff(null); }} onSave={saveStaff} editStaff={editStaff} />
      <LeaveForm isOpen={showLeaveForm} onClose={() => setShowLeaveForm(false)} onSave={saveLeave} staff={staff} />
    </div>
  );
}

// ══════════════════════════════
// ── STOCK ADJUSTMENT FORM ──
// ══════════════════════════════
function StockAdjustmentForm({isOpen, onClose, onSave, inventory}) {
  const [itemId, setItemId] = useState('');
  const [type, setType] = useState('delivery');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => { if (isOpen) { setItemId(''); setType('delivery'); setQty(1); setNotes(''); } }, [isOpen]);

  function handleSave() {
    if (!itemId) return;
    const actualQty = type === 'waste' ? -Math.abs(qty) : Math.abs(qty);
    onSave({ id: genId('ADJ'), itemId, type, qty: actualQty, notes, date: '2026-03-08', by: 'EMP001' });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stock Adjustment">
      <FormField label="Item">
        <select value={itemId} onChange={e => setItemId(e.target.value)} style={inputStyle}>
          <option value="">Select...</option>
          {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </FormField>
      <FormField label="Type">
        <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
          <option value="delivery">Delivery</option>
          <option value="waste">Waste</option>
          <option value="stock-take">Stock Take Correction</option>
        </select>
      </FormField>
      <FormField label="Quantity">
        <input type="number" value={qty} onChange={e => setQty(+e.target.value)} style={inputStyle} min="1" />
      </FormField>
      <FormField label="Notes"><input value={notes} onChange={e => setNotes(e.target.value)} style={inputStyle} placeholder="Optional" /></FormField>
      <PillButton icon={Icon.Save} bg="var(--accent)" onClick={handleSave} style={{width: '100%', justifyContent: 'center', marginTop: 8}}>Save Adjustment</PillButton>
    </Modal>
  );
}

// ══════════════════════════════
// ── PAGE: INVENTORY ──
// ══════════════════════════════
function InventoryPage({inventory, setInventory, addToast}) {
  const [search, setSearch] = useState('');
  const [stockTakeMode, setStockTakeMode] = useState(false);
  const [stockEdits, setStockEdits] = useState({});
  const [showAdjForm, setShowAdjForm] = useState(false);

  const today = new Date('2026-03-08');
  const sorted = [...inventory]
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.currentStock / a.minStock) - (b.currentStock / b.minStock));

  const lowStock = inventory.filter(i => i.currentStock <= i.minStock);
  const expiringItems = inventory.filter(i => {
    const daysSince = Math.floor((today - new Date(i.lastOrdered)) / 86400000);
    return i.shelfLife - daysSince <= 7 && i.shelfLife - daysSince > 0;
  });

  function startStockTake() {
    const edits = {};
    inventory.forEach(i => { edits[i.id] = i.currentStock; });
    setStockEdits(edits);
    setStockTakeMode(true);
  }

  function saveStockTake() {
    setInventory(prev => prev.map(item => ({...item, currentStock: stockEdits[item.id] ?? item.currentStock})));
    setStockTakeMode(false);
    addToast('Stock take saved', 'success');
  }

  function adjustStock(id, delta) {
    setStockEdits(prev => ({...prev, [id]: Math.max(0, (prev[id] || 0) + delta)}));
  }

  function saveAdjustment(adj) {
    setInventory(prev => prev.map(item => item.id === adj.itemId ? {...item, currentStock: Math.max(0, item.currentStock + adj.qty)} : item));
    addToast('Stock adjusted', 'success');
  }

  return (
    <div className="page-enter">
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20}}>
        <h1 style={{fontSize: 20, fontWeight: 700, flex: 1}}>Inventory</h1>
        <PillButton icon={Icon.CirclePlus} bg="var(--surface2)" onClick={() => setShowAdjForm(true)} style={{padding: '8px 16px', fontSize: 12}}>Adjust</PillButton>
        {stockTakeMode
          ? <PillButton icon={Icon.Save} bg="var(--accent)" onClick={saveStockTake}>Save</PillButton>
          : <PillButton icon={Icon.Package} bg="var(--accent)" onClick={startStockTake}>Stock Take</PillButton>
        }
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search items..." />

      {/* Reorder Suggestions */}
      {!stockTakeMode && lowStock.length > 0 && (
        <Card style={{margin: '16px 0', padding: '14px 18px', background: 'var(--accent2)08', border: '1px solid var(--accent2)22'}}>
          <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6}}>
            <Icon.AlertTriangle size={14} color="var(--accent2)" /> Reorder Suggestions
          </div>
          {lowStock.map(item => {
            const suggestedQty = item.minStock * 2 - item.currentStock;
            return (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 12, borderTop: '1px solid var(--surface2)'}}>
                <span>{item.name}</span>
                <span style={{fontWeight: 600}}>Order {Math.ceil(suggestedQty)} {item.unit}</span>
              </div>
            );
          })}
        </Card>
      )}

      {/* Expiry Warnings */}
      {!stockTakeMode && expiringItems.length > 0 && (
        <Card style={{marginBottom: 16, padding: '14px 18px', background: '#C4900008', border: '1px solid #C4900022'}}>
          <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6}}>
            <Icon.Clock size={14} color="#B8860B" /> Expiry Warnings
          </div>
          {expiringItems.map(item => {
            const daysSince = Math.floor((today - new Date(item.lastOrdered)) / 86400000);
            const daysLeft = item.shelfLife - daysSince;
            return (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 12, borderTop: '1px solid var(--surface2)'}}>
                <span>{item.name}</span>
                <Pill bg="#C4900022" color="#B8860B" style={{fontSize: 9}}>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</Pill>
              </div>
            );
          })}
        </Card>
      )}

      <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16}}>
        {sorted.length === 0 && <EmptyState message="No items match your search" />}
        {sorted.map(item => {
          const ratio = (stockTakeMode ? (stockEdits[item.id] ?? item.currentStock) : item.currentStock) / item.minStock;
          const currentVal = stockTakeMode ? (stockEdits[item.id] ?? item.currentStock) : item.currentStock;
          const isLow = ratio <= 1;
          const barColor = ratio <= 0.5 ? 'var(--accent2)' : ratio <= 1 ? '#C49000' : 'var(--accent)';
          const barWidth = Math.min(100, ratio * 100);
          return (
            <Card key={item.id} style={{padding: '14px 18px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{background: catColor(item.category) + '22', borderRadius: 10, padding: 7, display: 'flex'}}>
                    <Icon.Package size={15} color={catColor(item.category)} />
                  </div>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 13}}>{item.name}</div>
                    <div style={{fontSize: 10, color: 'var(--muted)'}}>{item.unit} — {item.category}</div>
                  </div>
                </div>
                <div style={{textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8}}>
                  {stockTakeMode && (
                    <>
                      <button onClick={() => adjustStock(item.id, -1)} style={{background: 'var(--surface2)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                        <Icon.Minus size={12} />
                      </button>
                    </>
                  )}
                  <div>
                    <div style={{fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums', color: isLow ? 'var(--accent2)' : 'var(--text)'}}>
                      {currentVal}
                    </div>
                    <div style={{fontSize: 9, color: 'var(--muted)'}}>min: {item.minStock}</div>
                  </div>
                  {stockTakeMode && (
                    <button onClick={() => adjustStock(item.id, 1)} style={{background: 'var(--surface2)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                      <Icon.Plus size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div style={{height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${barWidth}%`, background: barColor, borderRadius: 3, transition: 'width .3s ease'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--muted)'}}>
                <span>Shelf life: {item.shelfLife}d</span>
                <span>Last ordered: {fmtDate(item.lastOrdered)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <StockAdjustmentForm isOpen={showAdjForm} onClose={() => setShowAdjForm(false)} onSave={saveAdjustment} inventory={inventory} />
    </div>
  );
}

// ══════════════════════════════
// ── DATE RANGE PICKER ──
// ══════════════════════════════
function DateRangePicker({from, to, onFromChange, onToChange, onPreset}) {
  return (
    <Card style={{marginBottom: 16, padding: '12px 16px'}}>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
        <FormField label="From" style={{marginBottom: 0, flex: 1, minWidth: 120}}>
          <input type="date" value={from} onChange={e => onFromChange(e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}} />
        </FormField>
        <FormField label="To" style={{marginBottom: 0, flex: 1, minWidth: 120}}>
          <input type="date" value={to} onChange={e => onToChange(e.target.value)} style={{...inputStyle, padding: '8px 10px', fontSize: 12}} />
        </FormField>
      </div>
      <div style={{display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap'}}>
        {[{label: 'This Week', from: '2026-03-01', to: '2026-03-07'}, {label: 'This Month', from: '2026-03-01', to: '2026-03-08'}, {label: 'Last Month', from: '2026-02-01', to: '2026-02-28'}].map(p => (
          <button key={p.label} onClick={() => onPreset(p.from, p.to)} style={{padding: '5px 12px', fontSize: 10, fontWeight: 600, border: 'none', borderRadius: 'var(--pill)', background: 'var(--surface2)', cursor: 'pointer', fontFamily: 'var(--font)', color: 'var(--text)'}}>
            {p.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════
// ── VOUCHER FORM ──
// ══════════════════════════════
function VoucherForm({isOpen, onClose, onSave}) {
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState(10);
  const [usedDate, setUsedDate] = useState('2026-03-08');

  useEffect(() => { if (isOpen) { setCode(''); setAmount(10); setUsedDate('2026-03-08'); } }, [isOpen]);

  function handleSave() {
    if (!code) return;
    const claimMonth = usedDate.substring(0, 7);
    onSave({ id: genId('VCH'), code, amount: +amount, usedDate, claimed: false, claimMonth });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Voucher">
      <FormField label="Voucher Code"><input value={code} onChange={e => setCode(e.target.value)} style={inputStyle} placeholder="e.g. OD-2603-005" /></FormField>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
        <FormField label="Amount ($)"><input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} /></FormField>
        <FormField label="Used Date"><input type="date" value={usedDate} onChange={e => setUsedDate(e.target.value)} style={inputStyle} /></FormField>
      </div>
      <PillButton icon={Icon.Save} bg="var(--accent)" onClick={handleSave} style={{width: '100%', justifyContent: 'center', marginTop: 8}}>Add Voucher</PillButton>
    </Modal>
  );
}

// ══════════════════════════════
// ── PAGE: REPORTS ──
// ══════════════════════════════
function ReportsPage({invoices, vouchers, setVouchers, addToast}) {
  const [from, setFrom] = useState('2026-03-01');
  const [to, setTo] = useState('2026-03-07');
  const [showVoucherForm, setShowVoucherForm] = useState(false);

  const filteredSales = DB.dailySales.filter(d => d.date >= from && d.date <= to);
  const filteredInvoices = invoices.filter(i => i.date >= from && i.date <= to);
  const weekRevenue = filteredSales.reduce((s, d) => s + d.revenue, 0);
  const weekTxns = filteredSales.reduce((s, d) => s + d.transactions, 0);
  const weekExpenses = filteredInvoices.reduce((s, i) => s + i.total, 0);
  const profit = weekRevenue - weekExpenses;

  // Expense by category
  const byCat = {};
  filteredInvoices.forEach(inv => {
    inv.items.forEach(item => { byCat[item.category] = (byCat[item.category] || 0) + item.amount; });
  });
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] || 1;

  // Supplier spend ranking
  const bySupplier = {};
  filteredInvoices.forEach(inv => {
    const sup = getSupplier(inv.supplierId);
    if (sup) bySupplier[sup.shortName] = (bySupplier[sup.shortName] || 0) + inv.total;
  });
  const supplierEntries = Object.entries(bySupplier).sort((a, b) => b[1] - a[1]);
  const maxSupplier = supplierEntries[0]?.[1] || 1;

  // Cash flow
  const cashFlowDays = filteredSales.map(day => {
    const dayExpenses = filteredInvoices.filter(i => i.date === day.date).reduce((s, i) => s + i.total, 0);
    return {...day, expenses: dayExpenses, net: day.revenue - dayExpenses};
  });
  let runningTotal = 0;
  cashFlowDays.forEach(d => { runningTotal += d.net; d.running = runningTotal; });

  // Vouchers
  const currentMonth = to.substring(0, 7);
  const monthVouchers = vouchers.filter(v => v.claimMonth === currentMonth);
  const voucherTotal = monthVouchers.reduce((s, v) => s + v.amount, 0);
  const voucherClaimed = monthVouchers.filter(v => v.claimed).reduce((s, v) => s + v.amount, 0);

  function toggleClaimed(id) {
    setVouchers(prev => prev.map(v => v.id === id ? {...v, claimed: !v.claimed} : v));
    addToast('Voucher updated', 'success');
  }

  function addVoucher(v) {
    setVouchers(prev => [...prev, v]);
    addToast('Voucher added', 'success');
  }

  function setPreset(f, t) { setFrom(f); setTo(t); }

  return (
    <div className="page-enter">
      <h1 style={{fontSize: 20, fontWeight: 700, marginBottom: 20}}>Reports</h1>

      <DateRangePicker from={from} to={to} onFromChange={setFrom} onToChange={setTo} onPreset={setPreset} />

      <SectionHeader title="P&L Summary" />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 28}}>
        <Card style={{background: 'var(--accent)11', padding: 14}}>
          <div style={{fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 2}}>Revenue</div>
          <div style={{fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent)'}}>{fmt(weekRevenue)}</div>
          <div style={{fontSize: 9, color: 'var(--muted)'}}>{weekTxns} txns</div>
        </Card>
        <Card style={{background: 'var(--accent2)11', padding: 14}}>
          <div style={{fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 2}}>Expenses</div>
          <div style={{fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent2)'}}>{fmt(weekExpenses)}</div>
          <div style={{fontSize: 9, color: 'var(--muted)'}}>{filteredInvoices.length} inv</div>
        </Card>
        <Card style={{background: profit > 0 ? 'var(--accent)11' : 'var(--accent2)11', padding: 14}}>
          <div style={{fontSize: 10, fontWeight: 600, color: 'var(--muted)', marginBottom: 2}}>Profit</div>
          <div style={{fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: profit > 0 ? 'var(--accent)' : 'var(--accent2)'}}>{fmt(profit)}</div>
          <div style={{fontSize: 9, color: 'var(--muted)'}}>{weekRevenue > 0 ? (profit / weekRevenue * 100).toFixed(1) : '0.0'}%</div>
        </Card>
      </div>

      {/* Cash Flow */}
      {cashFlowDays.length > 0 && <>
        <SectionHeader title="Cash Flow" />
        <Card style={{marginBottom: 28, padding: 14, overflow: 'hidden'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {cashFlowDays.map(d => (
              <div key={d.date} style={{display: 'flex', alignItems: 'center', fontSize: 11, padding: '4px 0', borderBottom: '1px solid var(--surface2)', gap: 6, minWidth: 0}}>
                <span style={{flexShrink: 0, fontWeight: 600, color: 'var(--muted)', fontSize: 10}}>{fmtDate(d.date)}</span>
                <span style={{flex: 1, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: 10}}>+{fmt(d.revenue)}</span>
                <span style={{flex: 1, color: 'var(--accent2)', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: 10}}>{d.expenses > 0 ? `-${fmt(d.expenses)}` : '-'}</span>
                <span style={{flex: 1, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 10, color: d.net >= 0 ? 'var(--accent)' : 'var(--accent2)'}}>{d.net >= 0 ? '+' : ''}{fmt(d.net)}</span>
              </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: 14, fontWeight: 700}}>
              <span>Running Total</span>
              <span style={{fontVariantNumeric: 'tabular-nums', color: runningTotal >= 0 ? 'var(--accent)' : 'var(--accent2)'}}>{fmt(runningTotal)}</span>
            </div>
          </div>
        </Card>
      </>}

      {/* Supplier Spend Ranking */}
      {supplierEntries.length > 0 && <>
        <SectionHeader title="Supplier Spend" />
        <Card style={{marginBottom: 28}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {supplierEntries.map(([name, amt], i) => {
              const colors = ['var(--accent)', '#4ECDC4', '#C49000', '#E88D67', '#A855F7', '#FF6B9D'];
              const color = colors[i % colors.length];
              const pct = (amt / maxSupplier) * 100;
              return (
                <div key={name}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                    <span style={{fontSize: 12, fontWeight: 600}}>{name}</span>
                    <span style={{fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(amt)}</span>
                  </div>
                  <div style={{height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .3s ease'}} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </>}

      <SectionHeader title="Expense by Category" />
      <Card style={{marginBottom: 28}}>
        {catEntries.length === 0 && <EmptyState message="No expenses in this period" icon={Icon.Receipt} />}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {catEntries.map(([cat, amt]) => {
            const color = catColor(cat);
            const pct = (amt / maxCat) * 100;
            return (
              <div key={cat}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                    <div style={{width: 8, height: 8, borderRadius: 4, background: color}} />
                    <span style={{fontSize: 12, fontWeight: 600, textTransform: 'capitalize'}}>{cat.replace('-', ' ')}</span>
                  </div>
                  <span style={{fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(amt)}</span>
                </div>
                <div style={{height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .3s ease'}} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Vouchers */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <h2 style={{fontSize: 18, fontWeight: 700}}>Vouchers — {new Date(to).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}</h2>
        <PillButton icon={Icon.CirclePlus} bg="var(--accent)" onClick={() => setShowVoucherForm(true)} style={{padding: '6px 14px', fontSize: 11}}>Add</PillButton>
      </div>
      <Card style={{marginBottom: 28}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
          <div>
            <div style={{fontSize: 10, color: 'var(--muted)', fontWeight: 600}}>Total this month</div>
            <div style={{fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(voucherTotal)}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 10, color: 'var(--muted)', fontWeight: 600}}>Claimed</div>
            <div style={{fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent)'}}>{fmt(voucherClaimed)}</div>
          </div>
        </div>
        {monthVouchers.length === 0 && <EmptyState message="No vouchers this month" icon={Icon.Ticket} />}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {monthVouchers.map(v => (
            <div key={v.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <Icon.Ticket size={14} color="var(--muted)" />
                <span style={{fontSize: 12, fontWeight: 600}}>{v.code}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{fmt(v.amount)}</span>
                <button onClick={() => toggleClaimed(v.id)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                  <Pill bg={v.claimed ? 'var(--accent)22' : 'var(--surface)'} color={v.claimed ? 'var(--accent)' : 'var(--muted)'} style={{fontSize: 9, cursor: 'pointer'}}>
                    {v.claimed ? 'CLAIMED' : 'PENDING'}
                  </Pill>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <VoucherForm isOpen={showVoucherForm} onClose={() => setShowVoucherForm(false)} onSave={addVoucher} />
    </div>
  );
}

// ══════════════════════════════
// ── MAIN APP ──
// ══════════════════════════════
function App() {
  // Lifted state
  const [invoices, setInvoices] = useState(DB.invoices);
  const [staff, setStaff] = useState(DB.staff);
  const [inventory, setInventory] = useState(DB.inventory);
  const [vouchers, setVouchers] = useState(DB.vouchers);
  const [timesheets, setTimesheets] = useState(DB.timesheets);
  const [leaveRequests, setLeaveRequests] = useState(DB.leaveRequests);

  // Navigation state
  const [nav, setNav] = useState({page: 'home', subView: null, id: null});
  const [prevNav, setPrevNav] = useState(null);

  function goTo(page, subView, id) {
    setPrevNav(nav);
    setNav({page, subView: subView || null, id: id || null});
  }
  function goBack() {
    if (prevNav) { setNav(prevNav); setPrevNav(null); }
    else setNav({page: nav.page, subView: null, id: null});
  }

  // Toast system
  const [toasts, setToasts] = useState([]);
  function addToast(msg, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, {id, msg, type}]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? {...t, exiting: true} : t)), 2000);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2200);
  }

  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  function openModal(name) { setActiveModal(name); }
  function closeModal() { setActiveModal(null); }

  function markInvoicePaid(id) {
    setInvoices(prev => prev.map(inv => inv.id === id ? {...inv, status: 'paid'} : inv));
  }

  function addInvoice(inv) {
    setInvoices(prev => [inv, ...prev]);
    addToast('Invoice added', 'success');
  }

  // Render current page
  function renderPage() {
    // Handle sub-views first
    if (nav.page === 'expenses' && nav.subView === 'detail' && nav.id) {
      return <InvoiceDetailView invoiceId={nav.id} invoices={invoices} onBack={goBack} onMarkPaid={markInvoicePaid} addToast={addToast} />;
    }

    switch (nav.page) {
      case 'home': return <HomePage invoices={invoices} staff={staff} inventory={inventory} timesheets={timesheets} leaveRequests={leaveRequests} goTo={goTo} openModal={openModal} />;
      case 'expenses': return <ExpensesPage invoices={invoices} goTo={goTo} openModal={openModal} />;
      case 'hr': return <HRPage staff={staff} timesheets={timesheets} leaveRequests={leaveRequests} setStaff={setStaff} setLeaveRequests={setLeaveRequests} addToast={addToast} openModal={openModal} initialTab={nav.subView} />;
      case 'inventory': return <InventoryPage inventory={inventory} setInventory={setInventory} addToast={addToast} />;
      case 'reports': return <ReportsPage invoices={invoices} vouchers={vouchers} setVouchers={setVouchers} addToast={addToast} />;
      default: return <HomePage invoices={invoices} staff={staff} inventory={inventory} timesheets={timesheets} leaveRequests={leaveRequests} goTo={goTo} openModal={openModal} />;
    }
  }

  const navItems = [
    {id: 'home', icon: Icon.Home, label: 'Home'},
    {id: 'expenses', icon: Icon.Receipt, label: 'Expenses'},
    {id: 'hr', icon: Icon.Users, label: 'HR'},
    {id: 'inventory', icon: Icon.Package, label: 'Inventory'},
    {id: 'reports', icon: Icon.BarChart3, label: 'Reports'},
  ];

  return (
    <div style={{maxWidth: 600, margin: '0 auto', padding: '16px 16px 90px'}}>
      <div key={nav.page + (nav.subView || '') + (nav.id || '')}>
        {renderPage()}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', boxShadow: '0 -2px 20px rgba(0,0,0,.06)',
        padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))', zIndex: 100,
      }}>
        <div style={{maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'space-around', padding: '0 12px'}}>
          {navItems.map(item => {
            const active = nav.page === item.id;
            return (
              <button key={item.id} onClick={() => goTo(item.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--muted)',
                transition: 'all .15s ease', fontFamily: 'var(--font)',
              }}>
                <item.icon size={18} color={active ? 'var(--text)' : 'var(--muted)'} />
                <span style={{fontSize: 9, fontWeight: active ? 700 : 500}}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Modals */}
      <ManualEntryForm isOpen={activeModal === 'manualEntry'} onClose={closeModal} onSave={addInvoice} />
      <UploadAreaModal isOpen={activeModal === 'upload'} onClose={closeModal} onOpenManual={() => openModal('manualEntry')} />

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
