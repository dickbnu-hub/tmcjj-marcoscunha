export default function Midia() {
  return (
    <section id="midia" className="py-24 bg-[#F2F2F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            Conteúdo
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight text-[#0A0A0A]">
            Mídia
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* YouTube — vídeo embed */}
          <div className="relative bg-[#0A0A0A] overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <iframe
              src="https://www.youtube.com/embed/P-UouqS4IFg"
              title="TMC Jiu-Jitsu"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Facebook */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative overflow-hidden"
            style={{ aspectRatio: "16/9", backgroundColor: "#1877F2" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <p className="text-base font-bold tracking-widest uppercase">Fotos no Facebook</p>
              <p className="text-xs text-white/70 mt-2 tracking-wide">
                Álbuns, eventos e galeria da academia
              </p>
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
