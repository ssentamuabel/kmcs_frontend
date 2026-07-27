import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RightsContext } from '../contexts/RightsProvider';
import { CONFIG } from '../config';
import '../styles/budget.css';
import {
  FaArrowLeft, FaWallet, FaPlus, FaTrash, FaCheckCircle,
  FaTimesCircle, FaExclamationTriangle, FaReceipt, FaPaperPlane, FaLockOpen
} from 'react-icons/fa';

const STATUS_LABELS = { draft: 'Draft', submitted: 'Submitted for Approval', approved: 'Approved', rejected: 'Rejected' };

const BudgetDetail = () => {
  const { id } = useParams();
  const { rights } = useContext(RightsContext);
  const [budget, setBudget] = useState(null);
  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [newLine, setNewLine] = useState({ item: '', quantity: '', unit_price: '', notes: '' });
  const [addingLine, setAddingLine] = useState(false);

  const [extraLineDraft, setExtraLineDraft] = useState({}); // { [expenseId]: {item, actual_quantity, actual_unit_price} }
  const [addingExtra, setAddingExtra] = useState({});
  const [lineEdits, setLineEdits] = useState({}); // { [lineId]: {actual_quantity, actual_unit_price} } — unsaved edits
  const [savingLine, setSavingLine] = useState({});

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [budgetRes, itemsRes, expensesRes] = await Promise.all([
        fetch(`${CONFIG.backend_url}/budgets/${id}/`, { credentials: 'include' }),
        fetch(`${CONFIG.backend_url}/items/`, { credentials: 'include' }),
        fetch(`${CONFIG.backend_url}/expenses/`, { credentials: 'include' }),
      ]);
      if (!budgetRes.ok) throw new Error('Failed to load budget');
      const budgetData = await budgetRes.json();
      const itemsData = itemsRes.ok ? await itemsRes.json() : [];
      const expensesData = expensesRes.ok ? await expensesRes.json() : [];

      setBudget(budgetData);
      setItems(Array.isArray(itemsData) ? itemsData : itemsData.results || []);
      const allExpenses = Array.isArray(expensesData) ? expensesData : expensesData.results || [];
      setExpenses(allExpenses.filter(e => e.budget === budgetData.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const callAction = async (action, body) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/budgets/${id}/${action}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body || {}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || `Failed to ${action}`);
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    setAddingLine(true);
    try {
      const res = await fetch(`${CONFIG.backend_url}/budget-lines/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          budget: budget.id,
          item: newLine.item,
          quantity: parseFloat(newLine.quantity),
          unit_price: parseFloat(newLine.unit_price),
          notes: newLine.notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to add line');
      setNewLine({ item: '', quantity: '', unit_price: '', notes: '' });
      await fetchAll();
    } catch (err) { setError(err.message); } finally { setAddingLine(false); }
  };

  const handleDeleteLine = async (lineId) => {
    try {
      const res = await fetch(`${CONFIG.backend_url}/budget-lines/${lineId}/`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete line');
      await fetchAll();
    } catch (err) { setError(err.message); }
  };

  const handleCreateExpense = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${CONFIG.backend_url}/budgets/${id}/create_expense/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Failed to create expense');
      await fetchAll();
    } catch (err) { setError(err.message); } finally { setActionLoading(false); }
  };

  const handleLineFieldChange = (lineId, line, field, value) => {
    setLineEdits(prev => ({
      ...prev,
      [lineId]: {
        actual_quantity: prev[lineId]?.actual_quantity ?? line.actual_quantity,
        actual_unit_price: prev[lineId]?.actual_unit_price ?? line.actual_unit_price,
        [field]: value,
      },
    }));
  };

  const handleSaveLine = async (lineId) => {
    const edit = lineEdits[lineId];
    if (!edit) return;
    setSavingLine(prev => ({ ...prev, [lineId]: true }));
    try {
      const res = await fetch(`${CONFIG.backend_url}/expense-lines/${lineId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          actual_quantity: parseFloat(edit.actual_quantity) || 0,
          actual_unit_price: parseFloat(edit.actual_unit_price) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Failed to save actual spend');
      setLineEdits(prev => {
        const next = { ...prev };
        delete next[lineId];
        return next;
      });
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingLine(prev => ({ ...prev, [lineId]: false }));
    }
  };

  const handleFinalizeExpense = async (expenseId) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/expenses/${expenseId}/finalize/`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Failed to finalize expense');
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfinalizeExpense = async (expenseId) => {
    if (!window.confirm('Reopen this expense for editing? Make sure the correction is actually needed.')) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/expenses/${expenseId}/unfinalize/`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Failed to reopen expense');
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddExtraLine = async (expenseId) => {
    const draft = extraLineDraft[expenseId];
    if (!draft || !draft.item || !draft.actual_quantity || !draft.actual_unit_price) return;
    setAddingExtra({ ...addingExtra, [expenseId]: true });
    try {
      const res = await fetch(`${CONFIG.backend_url}/expense-lines/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          expense: expenseId,
          item: draft.item,
          actual_quantity: parseFloat(draft.actual_quantity),
          actual_unit_price: parseFloat(draft.actual_unit_price),
          notes: draft.notes || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to add extra item');
      setExtraLineDraft({ ...extraLineDraft, [expenseId]: {} });
      await fetchAll();
    } catch (err) { setError(err.message); } finally { setAddingExtra({ ...addingExtra, [expenseId]: false }); }
  };

  if (loading) {
    return <div className="budget-loading"><div className="loading-spinner"></div><p>Loading Budget...</p></div>;
  }

  if (!budget) {
    return <div className="budget-error-banner">Budget not found.</div>;
  }

  const totalBudgeted = (budget.lines || []).reduce((s, l) => s + parseFloat(l.total || 0), 0);
  const totalActual = expenses.reduce((s, e) => s + (e.lines || []).reduce((s2, l) => s2 + parseFloat(l.total || 0), 0), 0);
  const variance = totalActual - totalBudgeted;

  const myRoleId = rights?.perm?.id;
  const currentApproval = budget.current_approval;
  const canActOnCurrentStep = currentApproval && myRoleId && currentApproval.role_id === myRoleId;

  return (
    <div className="budget-detail-container">
      <div className="view-header">
        <Link to="/budgets" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Budgets</Link>
        <div className="header-actions">
          {budget.status === 'draft' && (
            <button className="btn btn-primary btn-with-icon" onClick={() => callAction('submit')} disabled={actionLoading}>
              <FaPaperPlane /> Submit for Approval
            </button>
          )}
          {budget.status === 'submitted' && canActOnCurrentStep && (
            <>
              <button className="btn btn-outline btn-with-icon" onClick={() => callAction('reject')} disabled={actionLoading}>
                <FaTimesCircle /> Reject
              </button>
              <button className="btn btn-primary btn-with-icon" onClick={() => callAction('approve')} disabled={actionLoading}>
                <FaCheckCircle /> Approve ({currentApproval.level_name})
              </button>
            </>
          )}
          {budget.status === 'approved' && expenses.length === 0 && (
            <button className="btn btn-primary btn-with-icon" onClick={handleCreateExpense} disabled={actionLoading}>
              <FaReceipt /> Create Expense
            </button>
          )}
        </div>
      </div>

      {error && <div className="budget-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="budget-summary-card">
        <div className={`status-badge status-${budget.status}`}>{STATUS_LABELS[budget.status]}</div>
        <h1>{budget.title}</h1>
        {budget.description && <p className="budget-description">{budget.description}</p>}

        <div className="budget-kpi-row">
          <div className="budget-kpi">
            <span className="kpi-label">Budgeted</span>
            <span className="kpi-value">{formatCurrency(totalBudgeted)}</span>
          </div>
          <div className="budget-kpi">
            <span className="kpi-label">Actual Spend</span>
            <span className="kpi-value">{formatCurrency(totalActual)}</span>
          </div>
          <div className="budget-kpi">
            <span className="kpi-label">Variance</span>
            <span className={`kpi-value ${variance > 0 ? 'over' : 'under'}`}>
              {variance > 0 ? '+' : ''}{formatCurrency(variance)}
            </span>
          </div>
        </div>
      </div>

      {/* Approval Chain */}
      {(budget.approvals || []).length > 0 && (
        <section className="budget-section">
          <h3><FaCheckCircle /> Approval Chain</h3>
          <div className="approval-timeline">
            {budget.approvals.map(step => (
              <div key={step.id} className={`approval-step approval-${step.status}`}>
                <div className="approval-step-badge">{step.level_order}</div>
                <div className="approval-step-body">
                  <div className="approval-step-name">{step.level_name} <span className="approval-step-role">({step.role_name})</span></div>
                  <div className="approval-step-status">
                    {step.status === 'pending' ? 'Awaiting action' : `${step.status === 'approved' ? 'Approved' : 'Rejected'} by ${step.acted_by_name || 'someone'}`}
                  </div>
                  {step.comment && <div className="approval-step-comment">"{step.comment}"</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Budget Lines */}
      <section className="budget-section">
        <h3><FaWallet /> Budget Lines</h3>
        <div className="budget-table-container">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Item</th><th className="align-right">Qty</th><th className="align-right">Unit Price</th>
                <th className="align-right">Total</th><th>Notes</th><th></th>
              </tr>
            </thead>
            <tbody>
              {(budget.lines || []).length === 0 ? (
                <tr><td colSpan="6" className="budget-empty-row">No line items yet</td></tr>
              ) : (
                budget.lines.map(line => (
                  <tr key={line.id}>
                    <td>{line.item_name || items.find(i => i.id === line.item)?.name || `Item #${line.item}`}</td>
                    <td className="align-right">{line.quantity}</td>
                    <td className="align-right">{formatCurrency(line.unit_price)}</td>
                    <td className="align-right">{formatCurrency(line.total)}</td>
                    <td>{line.notes || '-'}</td>
                    <td>
                      {budget.status === 'draft' && (
                        <button className="icon-btn icon-btn-danger" onClick={() => handleDeleteLine(line.id)}><FaTrash /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {budget.status === 'draft' && (
          <form className="inline-add-form" onSubmit={handleAddLine}>
            <select value={newLine.item} onChange={e => setNewLine({ ...newLine, item: e.target.value })} required>
              <option value="">Select item…</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Qty" value={newLine.quantity} onChange={e => setNewLine({ ...newLine, quantity: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Unit Price" value={newLine.unit_price} onChange={e => setNewLine({ ...newLine, unit_price: e.target.value })} required />
            <input type="text" placeholder="Notes (optional)" value={newLine.notes} onChange={e => setNewLine({ ...newLine, notes: e.target.value })} />
            <button type="submit" className="btn btn-primary btn-with-icon" disabled={addingLine}>
              <FaPlus /> Add Line
            </button>
          </form>
        )}
      </section>

      {/* Expenses — the copied budget, with actuals entered against it */}
      {expenses.length > 0 && (
        <section className="budget-section">
          <h3><FaReceipt /> Expenditure</h3>
          <p className="budget-section-hint">
            Planned quantity/unit price are locked (copied from the approved budget) — only the actual columns are editable.
            Use "Add Unbudgeted Item" for spend that wasn't part of the original plan.
          </p>

          {expenses.map(expense => {
            const isFinalized = expense.status === 'finalized';
            return (
            <div key={expense.id} className="expense-card">
              <div className="expense-card-header">
                <span>{expense.title}</span>
                <div className="expense-card-header-actions">
                  <span className={`status-badge status-${isFinalized ? 'approved' : 'draft'}`}>
                    {isFinalized ? 'Finalized' : 'Draft'}
                  </span>
                  {isFinalized ? (
                    <button
                      className="btn btn-outline btn-sm btn-with-icon"
                      onClick={() => handleUnfinalizeExpense(expense.id)}
                      disabled={actionLoading}
                    >
                      <FaLockOpen /> Reopen
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm btn-with-icon"
                      onClick={() => handleFinalizeExpense(expense.id)}
                      disabled={actionLoading}
                    >
                      <FaCheckCircle /> Finalize Expense
                    </button>
                  )}
                </div>
              </div>
              {isFinalized && expense.finalized_by_name && (
                <div className="budget-section-hint" style={{ marginTop: -8, marginBottom: 12 }}>
                  Finalized by {expense.finalized_by_name} on {new Date(expense.finalized_at).toLocaleString()}
                </div>
              )}
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="align-right">Planned Qty</th>
                    <th className="align-right">Planned Price</th>
                    <th className="align-right">Actual Qty</th>
                    <th className="align-right">Actual Price</th>
                    <th className="align-right">Total</th>
                    <th className="align-right">Variance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(expense.lines || []).map(l => {
                    const edit = lineEdits[l.id];
                    const isDirty = !!edit;
                    return (
                    <tr key={l.id} className={l.is_extra ? 'expense-line-extra' : ''}>
                      <td>{l.item_name} {l.is_extra && <span className="extra-tag">Unbudgeted</span>}</td>
                      <td className="align-right locked-cell">{l.planned_quantity ?? '—'}</td>
                      <td className="align-right locked-cell">{l.planned_unit_price ? formatCurrency(l.planned_unit_price) : '—'}</td>
                      <td className="align-right">
                        <input
                          type="number" step="0.01" className="inline-edit-input"
                          value={edit ? edit.actual_quantity : l.actual_quantity}
                          disabled={isFinalized}
                          onChange={e => handleLineFieldChange(l.id, l, 'actual_quantity', e.target.value)}
                        />
                      </td>
                      <td className="align-right">
                        <input
                          type="number" step="0.01" className="inline-edit-input"
                          value={edit ? edit.actual_unit_price : l.actual_unit_price}
                          disabled={isFinalized}
                          onChange={e => handleLineFieldChange(l.id, l, 'actual_unit_price', e.target.value)}
                        />
                      </td>
                      <td className="align-right">{formatCurrency(l.total)}</td>
                      <td className={`align-right ${l.variance > 0 ? 'over' : 'under'}`}>
                        {l.variance > 0 ? '+' : ''}{formatCurrency(l.variance)}
                      </td>
                      <td>
                        {isDirty && !isFinalized && (
                          <button
                            className="btn btn-primary btn-sm btn-with-icon"
                            onClick={() => handleSaveLine(l.id)}
                            disabled={savingLine[l.id]}
                          >
                            {savingLine[l.id] ? 'Saving…' : 'Save'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>

              {!isFinalized && (
              <div className="inline-add-form">
                <select
                  value={(extraLineDraft[expense.id] || {}).item || ''}
                  onChange={e => setExtraLineDraft({ ...extraLineDraft, [expense.id]: { ...extraLineDraft[expense.id], item: e.target.value } })}
                >
                  <option value="">Select unbudgeted item…</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <input
                  type="number" step="0.01" placeholder="Actual Qty"
                  value={(extraLineDraft[expense.id] || {}).actual_quantity || ''}
                  onChange={e => setExtraLineDraft({ ...extraLineDraft, [expense.id]: { ...extraLineDraft[expense.id], actual_quantity: e.target.value } })}
                />
                <input
                  type="number" step="0.01" placeholder="Actual Unit Price"
                  value={(extraLineDraft[expense.id] || {}).actual_unit_price || ''}
                  onChange={e => setExtraLineDraft({ ...extraLineDraft, [expense.id]: { ...extraLineDraft[expense.id], actual_unit_price: e.target.value } })}
                />
                <button className="btn btn-outline btn-with-icon" onClick={() => handleAddExtraLine(expense.id)} disabled={addingExtra[expense.id]}>
                  <FaPlus /> Add Unbudgeted Item
                </button>
              </div>
              )}
            </div>
          )})}
        </section>
      )}
    </div>
  );
};

export default BudgetDetail;
