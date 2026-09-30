import './Confirmation.css';

export function Confirmation ({ message, confirmLabel, pendingLabel, onCancel, onConfirm, isPending }) {

    return (
        <div className="confirmation">
            <p className="confirmation-message">{message}</p>

            <div className="confirmation-actions">
                <button className="button" type="button" onClick={onCancel}>
                    Cancel
                </button>

                <button disabled={isPending} className="button danger-button" type="button" onClick={onConfirm}>
                    {isPending ? pendingLabel : confirmLabel}
                </button>
            </div>
        </div>
    );
}