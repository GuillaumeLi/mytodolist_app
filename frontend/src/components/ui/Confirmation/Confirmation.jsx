import './Confirmation.css';

export function Confirmation ({ message, onCancel, onConfirm }) {

    return (
        <div className="confirmation">
            <p className="confirmation-message">{message}</p>

            <div className="confirmation-actions">
                <button className="button" type="button" onClick={onCancel}>
                    Cancel
                </button>

                <button className="button primary-button" type="button" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        </div>
    );
}