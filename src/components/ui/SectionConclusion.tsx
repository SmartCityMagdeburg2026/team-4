interface SectionConclusionProps {
  text: string;
}

export function SectionConclusion({ text }: SectionConclusionProps) {
  return (
    <p className="font-serif text-lg md:text-xl text-ink leading-relaxed border-l-2 border-accent pl-5 mb-8 md:mb-10">
      {text}
    </p>
  );
}
