export default function IncomingCall({ fromUser, onAccept, onReject }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3 style={styles.title}>Llamada entrante</h3>
        <p style={styles.text}>Usuario: {fromUser}</p>

        <div style={styles.actions}>
          <button style={styles.accept} onClick={onAccept}>Aceptar</button>
          <button style={styles.reject} onClick={onReject}>Rechazar</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },
  card: {
    background: "#2f3136",
    padding: "20px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    textAlign: "center",
    color: "white"
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  text: {
    fontSize: "16px",
    marginBottom: "20px",
    opacity: 0.7
  },
  actions: {
    display: "flex",
    justifyContent: "space-between"
  },
  accept: {
    padding: "10px 20px",
    background: "#3ba55d",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white"
  },
  reject: {
    padding: "10px 20px",
    background: "#ed4245",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white"
  }
};
