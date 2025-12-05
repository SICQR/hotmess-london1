function AgeGate() {
  return (
    <div className="absolute h-[20px] left-[32px] top-[846.77px] w-[149.602px]" data-name="AgeGate">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.06)] text-nowrap top-[0.5px] tracking-[1.2496px] uppercase whitespace-pre">HOTMESS LONDON</p>
    </div>
  );
}

function AgeGate1() {
  return (
    <div className="absolute h-[440.977px] left-[96px] shadow-[0px_4px_28px_0px_rgba(0,0,0,0.25)] top-0 w-[450.18px]" data-name="AgeGate">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[88.2px] left-0 not-italic text-[98px] text-white top-[1.5px] tracking-[-2.94px] uppercase w-[451px]">MEN ONLY. 18+. CONSENT ALWAYS.</p>
    </div>
  );
}

function AgeGate2() {
  return (
    <div className="absolute h-[30.797px] left-[96px] top-[464.98px] w-[450.18px]" data-name="AgeGate">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30.8px] left-0 not-italic text-[22px] text-[rgba(255,255,255,0.8)] text-nowrap top-px tracking-[0.6222px] whitespace-pre">{`If that's you — enter. If not — bounce.`}</p>
    </div>
  );
}

function AgeGate3() {
  return <div className="absolute bg-[rgba(255,255,255,0.65)] left-0 rounded-[1.67772e+07px] size-[4px] top-[12px]" data-name="AgeGate" />;
}

function ListItem() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <AgeGate3 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[18px] text-[rgba(255,255,255,0.65)] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">You must be 18+</p>
    </div>
  );
}

function AgeGate4() {
  return <div className="absolute bg-[rgba(255,255,255,0.65)] left-0 rounded-[1.67772e+07px] size-[4px] top-[12px]" data-name="AgeGate" />;
}

function ListItem1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <AgeGate4 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[18px] text-[rgba(255,255,255,0.65)] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">You must be a man</p>
    </div>
  );
}

function AgeGate5() {
  return <div className="absolute bg-[rgba(255,255,255,0.65)] left-0 rounded-[1.67772e+07px] size-[4px] top-[12px]" data-name="AgeGate" />;
}

function ListItem2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <AgeGate5 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[18px] text-[rgba(255,255,255,0.65)] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">You must consent</p>
    </div>
  );
}

function AgeGate6() {
  return <div className="absolute bg-[rgba(255,255,255,0.65)] left-0 rounded-[1.67772e+07px] size-[4px] top-[12px]" data-name="AgeGate" />;
}

function ListItem3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <AgeGate6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[16px] not-italic text-[18px] text-[rgba(255,255,255,0.65)] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">You must enter willingly</p>
    </div>
  );
}

function AgeGate7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[148px] items-start left-[96px] top-[543.77px] w-[450.18px]" data-name="AgeGate">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[72px] relative rounded-[4px] shrink-0 w-[360px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[72px] relative w-[360px]">
        <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[35.2px] left-[180.28px] not-italic text-[22px] text-black text-center text-nowrap top-[18.9px] tracking-[0.2922px] translate-x-[-50%] uppercase whitespace-pre">ENTER</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[52.117px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[52.117px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[26px] not-italic text-[16px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">LEAVE</p>
      </div>
    </div>
  );
}

function AgeGate8() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[72px] items-center left-[96px] top-[739.77px] w-[450.18px]" data-name="AgeGate">
      <Button />
      <Button1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[39px] left-[96px] top-[859.77px] w-[450.18px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.25)] top-[0.5px] w-[439px]">Men-only. 18+. Consent required. Aftercare = info + community, not medical advice.</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[898.773px] left-0 top-0 w-[642.18px]" data-name="Container">
      <AgeGate1 />
      <AgeGate2 />
      <AgeGate7 />
      <AgeGate8 />
      <Paragraph />
    </div>
  );
}

function ImageGateHero() {
  return (
    <div className="absolute h-[747px] left-0 top-0 w-[458.82px]" data-name="Image (Gate hero)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="604709d6aa4cdffb3dd42c7e3a494cbb87890abe.png" />
    </div>
  );
}

function Container1() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.4)] h-[747px] left-0 to-[rgba(0,0,0,0)] top-0 w-[458.82px]" data-name="Container" />;
}

function Container2() {
  return (
    <div className="absolute h-[747px] left-[642.18px] overflow-clip rounded-[10px] top-0 w-[458.82px]" data-name="Container">
      <ImageGateHero />
      <Container1 />
    </div>
  );
}

function AgeGate9() {
  return (
    <div className="absolute h-[898.773px] left-0 top-0 w-[1101px]" data-name="AgeGate">
      <Container />
      <Container2 />
    </div>
  );
}

function HF() {
  return (
    <div className="absolute bg-black h-[898.773px] left-0 overflow-clip top-0 w-[1101px]" data-name="hF">
      <AgeGate />
      <AgeGate9 />
    </div>
  );
}

export default function ProjectStructureOverview() {
  return (
    <div className="bg-black relative size-full" data-name="Project Structure Overview">
      <HF />
    </div>
  );
}