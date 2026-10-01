import { Reveal } from "./ui.jsx";

export default function HowTo({ instagram }) {
  const steps = [
    ["Arma tu pedido", "Elige 5 o 10 ml de cada perfume y súmalos. Puedes mezclar marcas y tamaños."],
    ["Copia el mensaje", "En tu pedido toca Copiar pedido. Queda listo con perfumes, tamaños y total."],
    [`Escríbenos a @${instagram}`, "Pega el mensaje en el chat de Instagram y coordinamos pago y envío contigo."],
  ];
  return (
    <section id="pedir" className="scroll-mt-16 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal><h2 className="max-w-[16ch] font-display text-[34px] leading-[1.05] sm:text-[40px] lg:text-[56px]">Pedir toma menos de un minuto</h2></Reveal>
        <div className="mt-8 grid gap-7 sm:mt-12 sm:gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="md:px-8 md:first:pl-0">
              <div>
                <p className="num font-display text-[48px] leading-none text-accent sm:text-[64px]">{i + 1}</p>
                <h3 className="mt-3 text-xl font-semibold sm:mt-4">{t}</h3>
                <p className="mt-2 max-w-[36ch] text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
