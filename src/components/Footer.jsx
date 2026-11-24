export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line py-8 text-center text-sm text-muted">
      <p>
        <span className="font-bold text-accent">Kisan</span>Kart · Farm fresh products, direct from farmers
      </p>
      <p className="mt-1 text-xs">© {new Date().getFullYear()} KisanKart. All rights reserved.</p>
    </footer>
  );
}
