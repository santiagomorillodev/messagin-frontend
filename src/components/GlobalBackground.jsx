import image from "../assets/background.jpg";

export default function GlobalBackground() {
  return (
    <>
      <div
        className="fixed inset-0 -z-50 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="fixed inset-0 -z-40 pointer-events-none"
        style={{
          background: "rgba(0, 0, 0, 0.60)",
          backdropFilter: "blur(20px)",
        }}
      />
    </>
  );
}
