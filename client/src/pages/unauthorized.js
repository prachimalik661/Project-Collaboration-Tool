const unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1 style={{ fontSize: "28px", color: "#e53e3e" }}>Access Denied ❌</h1>
      <p style={{ fontSize: "18px", marginTop: "10px" }}>
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default unauthorized;
