interface ForgotPasswordSuccessProps {
  cooldown: number;
  isSubmitting: boolean;
  onResend: () => void;
}

export const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({
  cooldown,
  isSubmitting,
  onResend,
}) => (
  <div className="subtitle" style={{ color: '#ff6b00' }}>
    Reset link has been sent to your email! Please check your inbox.

    <button
      type="button"
      className="submit-btn"
      onClick={onResend}
      disabled={cooldown > 0 || isSubmitting}
      style={{ marginTop: '20px' }}
    >
      {isSubmitting
        ? 'Sending...'
        : cooldown > 0
          ? `Send again in ${cooldown}s`
          : 'Send again'}
    </button>
  </div>
);
