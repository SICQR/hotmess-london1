import svgPaths from "./svg-6a3wz89m74";
import imgCanvas from "figma:asset/51d4953c87f1877720b332c4f3900bac33f85eba.png";

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-0.6084px] uppercase whitespace-pre">LIVE GLOBE</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-[0.5px] tracking-[0.6px] uppercase whitespace-pre">BEACONS × RADIO LISTENERS WORLDWIDE</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[79.195px] relative shrink-0 w-[285.969px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[79.195px] items-start relative w-[285.969px]">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.73px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_96_626)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_96_626">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 grow h-[39.195px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39.195px] relative w-full">
        <Icon />
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[19.2px] left-[63.5px] not-italic text-[12px] text-center text-nowrap text-white top-[10.5px] translate-x-[-50%] whitespace-pre">GLOBE</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.73px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_96_621)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
          <path d={svgPaths.p245eb100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_96_621">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[39.195px] relative shrink-0 w-[100.633px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39.195px] relative w-[100.633px]">
        <Icon1 />
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[19.2px] left-[62px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[10.5px] translate-x-[-50%] whitespace-pre">STATS</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[39.195px] relative shrink-0 w-[210.898px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[39.195px] items-start relative w-[210.898px]">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[79.195px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[51.2px] left-0 not-italic text-[32px] text-nowrap text-white top-[0.5px] tracking-[0.4063px] whitespace-pre">0</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">Total Beacons</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col gap-[4px] h-[105.195px] items-start left-0 pb-px pt-[17px] px-[17px] top-0 w-[204.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[51.2px] left-0 not-italic text-[32px] text-nowrap text-white top-[0.5px] tracking-[0.4063px] whitespace-pre">0</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">Active</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col gap-[4px] h-[105.195px] items-start left-[220.4px] pb-px pt-[17px] px-[17px] top-0 w-[204.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[51.2px] left-0 not-italic text-[32px] text-nowrap text-white top-[0.5px] tracking-[0.4063px] whitespace-pre">15</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">Live Listeners</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col gap-[4px] h-[105.195px] items-start left-[440.8px] pb-px pt-[17px] px-[17px] top-0 w-[204.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[51.2px] left-0 not-italic text-[32px] text-nowrap text-white top-[0.5px] tracking-[0.4063px] whitespace-pre">0</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">Total Scans</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col gap-[4px] h-[105.195px] items-start left-[661.2px] pb-px pt-[17px] px-[17px] top-0 w-[204.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[51.2px] left-0 not-italic text-[32px] text-white top-[0.5px] tracking-[0.4063px] w-[75px]">0.0K</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">XP Awarded</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col gap-[4px] h-[105.195px] items-start left-[881.59px] pb-px pt-[17px] px-[17px] top-0 w-[204.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[105.195px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container8 />
      <Container11 />
      <Container14 />
      <Container17 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function BeaconsGlobe() {
  return (
    <div className="basis-0 grow h-[17.594px] min-h-px min-w-px relative shrink-0" data-name="BeaconsGlobe">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.594px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[17.6px] left-[28px] not-italic text-[11px] text-center text-nowrap text-white top-0 tracking-[0.0645px] translate-x-[-50%] whitespace-pre">BEACONS</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[35.594px] relative shrink-0 w-[114.969px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[35.594px] items-center px-[17px] py-px relative w-[114.969px]">
        <Icon2 />
        <BeaconsGlobe />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2d30eb88} id="Vector" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p8c7f8f0} id="Vector_2" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2b36b9c0} id="Vector_3" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18ed8900} id="Vector_4" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_5" stroke="var(--stroke-0, #00B8DB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function BeaconsGlobe1() {
  return (
    <div className="basis-0 grow h-[17.594px] min-h-px min-w-px relative shrink-0" data-name="BeaconsGlobe">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.594px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[17.6px] left-[19.5px] not-italic text-[11px] text-center text-nowrap text-white top-0 tracking-[0.0645px] translate-x-[-50%] whitespace-pre">RADIO</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(0,184,219,0.2)] h-[35.594px] relative shrink-0 w-[95.758px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#00b8db] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[35.594px] items-center px-[17px] py-px relative w-[95.758px]">
        <Icon3 />
        <BeaconsGlobe1 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[12px] h-[35.594px] items-start relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[325.984px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_2px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[325.984px] items-start pb-[2px] pt-[32px] px-[32px] relative w-full">
          <Container2 />
          <Container18 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Canvas() {
  return (
    <div className="absolute h-[388px] left-0 top-0 w-[1150px]" data-name="Canvas">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCanvas} />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">CONTROLS</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.6px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-nowrap top-0 tracking-[0.0645px] whitespace-pre">🖱️ DRAG TO ROTATE</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.6px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-nowrap top-0 tracking-[0.0645px] whitespace-pre">🔍 SCROLL TO ZOOM</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.6px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-nowrap top-0 tracking-[0.0645px] whitespace-pre">👆 CLICK MARKER FOR INFO</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[60.781px] items-start relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[8px] h-[118.781px] items-start left-[24px] pb-px pt-[17px] px-[17px] top-[245.22px] w-[178.102px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <Container21 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">LEGEND</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-[42.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.594px] relative w-[42.578px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.6px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-nowrap top-0 tracking-[0.0645px] whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[8px] h-[17.594px] items-center relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Text />
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-[#00b8db] relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 grow h-[17.594px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.594px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.6px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] text-nowrap top-0 tracking-[0.0645px] whitespace-pre">Radio Listeners</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[8px] h-[17.594px] items-center relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Text1 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[43.188px] items-start relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[12px] h-[105.188px] items-start left-[992.26px] pb-px pt-[17px] px-[17px] top-[258.81px] w-[133.742px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <Container27 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[388px] relative shrink-0 w-full" data-name="Container">
      <Canvas />
      <Container26 />
      <Container33 />
    </div>
  );
}

function BeaconsGlobe2() {
  return (
    <div className="bg-black content-stretch flex flex-col h-[713.984px] items-start relative shrink-0 w-full" data-name="BeaconsGlobe">
      <Container20 />
      <Container34 />
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-start left-0 top-[3px] w-[70.008px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[22.75px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-nowrap tracking-[-0.1504px] whitespace-pre">Aftercare:</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[22.75px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-[70.01px] not-italic text-[14px] text-[rgba(255,255,255,0.8)] text-nowrap top-px tracking-[-0.1504px] whitespace-pre">{`Information and support options—not medical advice. If you're in immediate danger, contact local emergency services (UK: 999).`}</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[72.75px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[72.75px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Paragraph1 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[16.8px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white tracking-[0.5496px] uppercase">{`Trust & Safety`}</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[37.078px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[19.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Legal</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[20px] left-0 top-[28px] w-[83.133px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[42.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[20px] left-0 top-[56px] w-[87.922px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[44.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Accessibility</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[20px] left-0 top-[84px] w-[115.367px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[58px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Abuse Reporting</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[20px] left-0 top-[112px] w-[42.883px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[21px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">DMCA</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[20px] left-0 top-[140px] w-[86.703px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[43px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Sponsorship</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[192.797px] items-start left-0 top-0 w-[319.328px]" data-name="Container">
      <Heading1 />
      <Container36 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[16.8px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white tracking-[0.5496px] uppercase">Quick Links</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[41.859px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[21px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">About</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[20px] left-0 top-[28px] w-[38.742px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Press</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[20px] left-0 top-[56px] w-[32.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[16px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Care</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[20px] left-0 top-[84px] w-[54.695px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[27px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Affiliate</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[104px] relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[192.797px] items-start left-[367.33px] top-0 w-[319.336px]" data-name="Container">
      <Heading2 />
      <Container38 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[16.8px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white tracking-[0.5496px] uppercase">Support</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[319.336px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">hello@hotmesslondon.com</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[20px] left-0 top-[32px] w-[138.102px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[69px] not-italic text-[14px] text-center text-nowrap text-white top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Hand N Hand (Care)</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[20px] left-0 top-[64px] w-[83.133px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-[42.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[84px] relative shrink-0 w-full" data-name="Container">
      <Link />
      <Button14 />
      <Button15 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[192.797px] items-start left-[734.66px] top-0 w-[319.336px]" data-name="Container">
      <Heading3 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[192.797px] relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container39 />
      <Container41 />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[20px] relative shrink-0 w-[249.055px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[249.055px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">© 2025 HOTMESS LONDON. 18+ only.</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.734px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[39.734px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[20.5px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Terms</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[47.109px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[47.109px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[24px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Privacy</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[26.5px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Cookies</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[20px] relative shrink-0 w-[186.742px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] h-[20px] items-start relative w-[186.742px]">
        <Button16 />
        <Button17 />
        <Button18 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="box-border content-stretch flex h-[53px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[494.547px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[494.547px] items-start pb-0 pt-[48px] px-[48px] relative w-full">
          <Container35 />
          <Container42 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black box-border content-stretch flex flex-col h-[495.547px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container46 />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[1209.53px] items-start left-0 pl-[320px] pr-0 py-0 top-0 w-[1470px]" data-name="App">
      <BeaconsGlobe2 />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[195.609px]" data-name="Navigation">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[42px] left-[98px] not-italic text-[42px] text-center text-nowrap text-white top-px tracking-[-1.3109px] translate-x-[-50%] uppercase whitespace-pre">HOTMESS</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-[52.445px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.594px] relative w-[52.445px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[17.6px] left-[26.5px] not-italic text-[11px] text-center text-nowrap text-white top-0 tracking-[0.6145px] translate-x-[-50%] uppercase whitespace-pre">LONDON</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="opacity-[0.913] relative rounded-[1.67772e+07px] shrink-0 size-[8px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[8px]" />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[17.594px] items-center left-0 top-[54px] w-[195.609px]" data-name="Navigation">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute h-[71.594px] left-[32px] top-[32px] w-[195.609px]" data-name="Button">
      <Navigation />
      <Navigation1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[83.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[83.016px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Your Stats</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Icon4 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[0.0703px] whitespace-pre">12</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px uppercase whitespace-pre">LVL</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-0 top-0 w-[65.664px]" data-name="Container">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[0.0703px] whitespace-pre">2.8K</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-[77.66px] top-0 w-[65.664px]" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[0.0703px] whitespace-pre">7D</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px uppercase whitespace-pre">Streak</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[52px] items-start left-[155.33px] top-0 w-[65.664px]" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container52 />
      <Container55 />
      <Container58 />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[12px] h-[114px] items-start left-[32px] pb-px pt-[17px] px-[17px] top-[129.59px] w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <Container49 />
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[276.594px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[276.594px] relative w-[319px]">
        <Button19 />
        <Container60 />
      </div>
    </div>
  );
}

function Navigation2() {
  return (
    <div className="absolute content-stretch flex h-[13.195px] items-start left-[8px] top-0 w-[255px]" data-name="Navigation">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[13.2px] min-h-px min-w-px not-italic relative shrink-0 text-[11px] text-white tracking-[0.6145px] uppercase">Core</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p9bbea0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.pfe0e100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Home</p>
      </div>
    </div>
  );
}

function Navigation3() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon5 />
      <Container62 />
    </div>
  );
}

function Button20() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p2b70c80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M2.84442 5.53117H19.1556" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p26150040} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container63() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Shop</p>
      </div>
    </div>
  );
}

function Navigation4() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon6 />
      <Container63 />
    </div>
  );
}

function Button21() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p1be44a80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M11 20.1667V11" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p3870cfc0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M6.875 3.91417L15.125 8.635" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">MessMarket</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[70.219px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[35.5px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIMITED</p>
      </div>
    </div>
  );
}

function Navigation5() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon7 />
      <Container64 />
      <Text3 />
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p4fb8250} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p2a70d080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p358aaf00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p3e889180} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p26528600} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Radio</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.477px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[45.477px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[23.5px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIVE</p>
      </div>
    </div>
  );
}

function Navigation6() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon8 />
      <Container65 />
      <Text4 />
    </div>
  );
}

function Button23() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_96_559)" id="Icon">
          <path d={svgPaths.p34f9e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p9065ec0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p26528600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p32bf9e80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
        <defs>
          <clipPath id="clip0_96_559">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[46.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[46.594px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[23px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">NEW</p>
      </div>
    </div>
  );
}

function Navigation7() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon9 />
      <Container66 />
      <Text5 />
    </div>
  );
}

function Button24() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.pd3643f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M13.75 5.28367V19.0337" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M8.25 2.96633V16.7163" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Map</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.141px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[53.141px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[27.5px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">SCAN</p>
      </div>
    </div>
  );
}

function Navigation8() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon10 />
      <Container67 />
      <Text6 />
    </div>
  );
}

function Button25() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation8 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p3dadee40} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-black text-nowrap top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[34.047px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[34.047px]">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[17.5px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">XP</p>
      </div>
    </div>
  );
}

function Navigation9() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-0 px-[16px] py-0 top-0 w-[271px]" data-name="Navigation">
      <Icon11 />
      <Container68 />
      <Text7 />
    </div>
  );
}

function Container69() {
  return <div className="absolute h-[46px] left-0 top-0 w-[4px]" data-name="Container" />;
}

function Button26() {
  return (
    <div className="bg-white h-[46px] overflow-clip relative shrink-0 w-full" data-name="Button">
      <Navigation9 />
      <Container69 />
    </div>
  );
}

function Navigation10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[382px] items-start left-0 top-[25.2px] w-[271px]" data-name="Navigation">
      <Button20 />
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[407.195px] relative shrink-0 w-full" data-name="Container">
      <Navigation2 />
      <Navigation10 />
    </div>
  );
}

function Navigation11() {
  return (
    <div className="absolute content-stretch flex h-[13.195px] items-start left-[8px] top-0 w-[255px]" data-name="Navigation">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[13.2px] min-h-px min-w-px not-italic relative shrink-0 text-[11px] text-white tracking-[0.6145px] uppercase">You</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p31d0da40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M13.75 11H2.75" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p340b8f80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container71() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Login</p>
      </div>
    </div>
  );
}

function Navigation12() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon12 />
      <Container71 />
    </div>
  );
}

function Button27() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation12 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p843c990} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p1848f500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Register</p>
      </div>
    </div>
  );
}

function Navigation13() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon13 />
      <Container72 />
    </div>
  );
}

function Button28() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation13 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[104px] items-start left-0 top-[25.2px] w-[271px]" data-name="Navigation">
      <Button27 />
      <Button28 />
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[129.195px] relative shrink-0 w-full" data-name="Container">
      <Navigation11 />
      <Navigation14 />
    </div>
  );
}

function Navigation15() {
  return (
    <div className="absolute content-stretch flex h-[13.195px] items-start left-[8px] top-0 w-[255px]" data-name="Navigation">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[13.2px] min-h-px min-w-px not-italic relative shrink-0 text-[11px] text-white tracking-[0.6145px] uppercase">Community</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p3c14b400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Care</p>
      </div>
    </div>
  );
}

function Navigation16() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon14 />
      <Container74 />
    </div>
  );
}

function Button29() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation16 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p80127a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p20ca0f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p1de049e0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p11b7c570} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Community</p>
      </div>
    </div>
  );
}

function Navigation17() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon15 />
      <Container75 />
    </div>
  );
}

function Button30() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation17 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p1ae3c480} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p1b4394e0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Trending</p>
      </div>
    </div>
  );
}

function Navigation18() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon16 />
      <Container76 />
    </div>
  );
}

function Button31() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[160px] items-start left-0 top-[25.2px] w-[271px]" data-name="Navigation">
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[185.195px] relative shrink-0 w-full" data-name="Container">
      <Navigation15 />
      <Navigation19 />
    </div>
  );
}

function Navigation20() {
  return (
    <div className="absolute content-stretch flex h-[13.195px] items-start left-[8px] top-0 w-[255px]" data-name="Navigation">
      <p className="basis-0 font-['Inter:Black',sans-serif] font-black grow leading-[13.2px] min-h-px min-w-px not-italic relative shrink-0 text-[11px] text-white tracking-[0.6145px] uppercase">System</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p514ae00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container78() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Legal</p>
      </div>
    </div>
  );
}

function Navigation21() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon17 />
      <Container78 />
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation21 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p32cc0100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p338e5b80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">Admin</p>
      </div>
    </div>
  );
}

function Navigation22() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon18 />
      <Container79 />
    </div>
  );
}

function Button33() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation22 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g clipPath="url(#clip0_96_582)" id="Icon">
          <path d={svgPaths.p3a1e8100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M18.3333 1.83333V5.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d="M20.1667 3.66667H16.5" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
          <path d={svgPaths.p1746de40} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29167" />
        </g>
        <defs>
          <clipPath id="clip0_96_582">
            <rect fill="white" height="22" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container80() {
  return (
    <div className="basis-0 grow h-[20.797px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20.797px] relative w-full">
        <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[20.8px] left-0 not-italic text-[13px] text-nowrap text-white top-[0.5px] tracking-[0.5738px] uppercase whitespace-pre">About</p>
      </div>
    </div>
  );
}

function Navigation23() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[46px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon19 />
      <Container80 />
    </div>
  );
}

function Button34() {
  return (
    <div className="bg-black h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[48px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation23 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[160px] items-start left-0 top-[25.2px] w-[271px]" data-name="Navigation">
      <Button32 />
      <Button33 />
      <Button34 />
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[185.195px] relative shrink-0 w-full" data-name="Container">
      <Navigation20 />
      <Navigation24 />
    </div>
  );
}

function Navigation25() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[319px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[32px] h-full items-start overflow-clip relative rounded-[inherit] w-[319px]">
        <Container70 />
        <Container73 />
        <Container77 />
        <Container81 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[25.594px] left-[77.64px] top-[15.2px] w-[115.719px]" data-name="Text">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[25.6px] left-[58px] not-italic text-[16px] text-center text-nowrap text-white top-[-1px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Shop RAW →</p>
    </div>
  );
}

function Button35() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Button">
      <Text8 />
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[105px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[105px] items-start pb-0 pt-[25px] px-[24px] relative w-[319px]">
        <Button35 />
      </div>
    </div>
  );
}

function Navigation26() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[668px] items-start left-0 pl-0 pr-px py-0 top-[138.5px] w-[320px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <Container61 />
      <Navigation25 />
      <Container82 />
    </div>
  );
}

export default function ProjectStructureOverview() {
  return (
    <div className="bg-black relative size-full" data-name="Project Structure Overview">
      <App />
      <Navigation26 />
    </div>
  );
}