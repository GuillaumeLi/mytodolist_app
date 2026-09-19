export function Confirmation ({ message, onCancel, onConfirm }) {

    return (
        <>
            <p>{message}</p>

            <button type="button" onClick={onCancel}>
                Cancel
            </button>

            <button type="button" onClick={onConfirm}>
                Confirm
            </button>
        </>
    );
}