export default function ActiveCall({
  remoteUser,
  onHangup,
  onMuteToggle,
  muted
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3 style={styles.title}>En llamada con {remoteUser}</h3>

        <div style={styles.controls}>
          <button style={styles.btn} onClick={onMuteToggle}>
            {muted ? "Quitar mute" : "Mute"}
          </button>

          <button style={styles.hangup} onClick={onHangup}>
            Colgar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999
  },
  card: {
    background: "#2f3136",
    padding: "16px",
    borderRadius: "10px",
    color: "#fff",
    minWidth: "260px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.4)"
  },
  title: {
    margin: 0,
    fontSize: "16px",
    marginBottom: "10px"
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  btn: {
    flex: 1,
    padding: "8px",
    background: "#5865f2",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  },
  hangup: {
    flex: 1,
    padding: "8px",
    background: "#ed4245",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  }
};
