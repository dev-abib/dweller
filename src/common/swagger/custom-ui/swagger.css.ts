export const SWAGGER_CUSTOM_CSS = `
  /* --- Auth status badge --- */
  .auth-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 12px;
    cursor: default;
    vertical-align: middle;
  }
  .auth-status-badge.authorized {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }
  .auth-status-badge.unauthorized {
    background-color: #fff3e0;
    color: #e65100;
    border: 1px solid #ffcc80;
  }
  .auth-status-badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .auth-status-badge.authorized .dot {
    background-color: #2e7d32;
  }
  .auth-status-badge.unauthorized .dot {
    background-color: #e65100;
  }
  /* --- Clear Auth button --- */
  .btn-auth-clear {
    display: none;
    margin-left: 8px;
    padding: 5px 12px;
    border: 1px solid #d32f2f;
    background-color: #fff;
    color: #d32f2f;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    vertical-align: middle;
    transition: all 0.15s ease;
  }
  .btn-auth-clear:hover {
    background-color: #d32f2f;
    color: #fff;
  }
  .btn-auth-clear:active {
    transform: scale(0.96);
  }
`;
