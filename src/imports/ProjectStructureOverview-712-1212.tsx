import svgPaths from "./svg-mbvfkqvjlj";
import imgCanvas from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";

function Canvas() {
  return (
    <div className="absolute h-0 left-0 top-0 w-[781px]" data-name="Canvas">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCanvas} />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[0.6172px] uppercase whitespace-pre">NIGHT PULSE</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[32px] left-0 not-italic text-[20px] text-white top-0 tracking-[-0.6492px] w-[162px]">0 ACTIVE ZONES</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-[0.5px] tracking-[-0.12px] whitespace-pre">Tonight</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[8px] h-[113.195px] items-start left-[16px] pb-px pt-[17px] px-[17px] top-[16px] w-[195.891px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[51.65px] not-italic text-[10px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[0.0172px] translate-x-[-50%] whitespace-pre">CONTROLS</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[51px] not-italic text-[10px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[0.0172px] translate-x-[-50%] whitespace-pre">Click cities for details</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[8px] h-[66px] items-start left-[637.49px] pb-px pt-[13px] px-[13px] top-[-82px] w-[127.508px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function NightPulseGlobe() {
  return (
    <div className="absolute h-0 left-0 top-[84.2px] w-[781px]" data-name="NightPulseGlobe">
      <Canvas />
      <Container />
      <Container1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[20.83%] left-[20.83%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
            <path d={svgPaths.p37c3e100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
            <path d="M12.5 0.833333H0.833333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[36px]">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[32px] left-0 not-italic text-[32px] text-nowrap text-white top-0 tracking-[-0.8737px] uppercase whitespace-pre">NIGHT PULSE</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-[0.5px] tracking-[-0.12px] whitespace-pre">Global beacon activity in real-time</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="basis-0 grow h-[51.195px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51.195px] items-start relative w-full">
        <Heading />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[51.195px] relative shrink-0 w-[249.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[51.195px] items-center relative w-[249.469px]">
        <Button />
        <Container2 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[16px] size-[12px] top-[12.34px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_712_1278)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_712_1278">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#ff1694] h-[34px] relative shrink-0 w-[103.898px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[34px] relative w-[103.898px]">
        <Icon1 />
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[62.5px] not-italic text-[12px] text-center text-nowrap text-white top-[9px] tracking-[-0.16px] translate-x-[-50%] whitespace-pre">TONIGHT</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[16px] size-[12px] top-[12.34px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M8 3.5H11V6.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
          <path d={svgPaths.p3a7e7417} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0.05)] grow h-[34px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[34px] relative w-full">
        <Icon2 />
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[64px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[9px] tracking-[-0.16px] translate-x-[-50%] whitespace-pre">WEEKEND</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[16px] size-[12px] top-[12.34px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[34px] relative shrink-0 w-[99.594px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[34px] relative w-[99.594px]">
        <Icon3 />
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[60.5px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[9px] tracking-[-0.16px] translate-x-[-50%] whitespace-pre">30 DAYS</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[34px] relative shrink-0 w-[328.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[34px] items-center relative w-[328.156px]">
        <Button1 />
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[51.195px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col h-[84.195px] items-start left-0 pb-px pt-[16px] px-[16px] top-0 w-[781px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container5 />
    </div>
  );
}

function NightPulse() {
  return (
    <div className="bg-black h-[684.195px] relative shrink-0 w-full" data-name="NightPulse">
      <NightPulseGlobe />
      <Container6 />
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-start left-0 top-[3px] w-[68.609px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[22.75px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-nowrap tracking-[-0.2904px] whitespace-pre">Aftercare:</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.8)] top-px tracking-[-0.2904px] w-[601px]">{`Information and support options—not medical advice. If you're in immediate danger, contact local emergency services (UK: 999).`}</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[95.5px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[95.5px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Paragraph6 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">{`Trust & Safety`}</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[36.273px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[18px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Legal</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[85.844px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[43.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Accessibility</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[112.969px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[56px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Abuse Reporting</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[21px] left-0 top-[116px] w-[42.242px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">DMCA</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[21px] left-0 top-[145px] w-[84.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[42px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Sponsorship</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[166px] relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-0 top-0 w-[196.328px]" data-name="Container">
      <Heading1 />
      <Container8 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">Quick Links</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[41.063px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">About</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[37.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Press</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[31.734px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[16px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Care</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[53.258px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[27px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Affiliate</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[244.33px] top-0 w-[196.336px]" data-name="Container">
      <Heading2 />
      <Container10 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">Support</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[196.328px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.3104px] whitespace-pre">hello@hotmesslondon.com</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[21px] left-0 top-[33px] w-[135.227px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[68.5px] not-italic text-[14px] text-center text-nowrap text-white top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Hand N Hand (Care)</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[21px] left-0 top-[66px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[87px] relative shrink-0 w-full" data-name="Container">
      <Link />
      <Button14 />
      <Button15 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[488.66px] top-0 w-[196.328px]" data-name="Container">
      <Heading3 />
      <Container12 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[197.398px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container11 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[21px] relative shrink-0 w-[243.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[243.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-0 tracking-[-0.3104px] whitespace-pre">© 2025 HOTMESS LONDON. 18+ only.</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[21px] relative shrink-0 w-[38.938px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[38.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Terms</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[45.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[45.992px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[23.5px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[25px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Cookies</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[21px] relative shrink-0 w-[183.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] h-[21px] items-start relative w-[183.711px]">
        <Button16 />
        <Button17 />
        <Button18 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="box-border content-stretch flex h-[54px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[522.898px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[522.898px] items-start pb-0 pt-[48px] px-[48px] relative w-full">
          <Container7 />
          <Container14 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black box-border content-stretch flex flex-col h-[523.898px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container18 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[1208.09px] items-start left-0 pl-[320px] pr-0 py-0 top-0 w-[1101px]" data-name="AppContent">
      <NightPulse />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute h-[38px] left-0 top-0 w-[255px]" data-name="Navigation">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[38px] left-0 not-italic text-[38px] text-nowrap text-white top-[0.5px] tracking-[-1.5289px] uppercase whitespace-pre">HOTMESS</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[56.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[56.219px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[28.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LONDON</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#e70f3c] relative shrink-0 size-[6px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[6px]" />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[50px] w-[255px]" data-name="Navigation">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Button">
      <Navigation />
      <Navigation1 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[81.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[81.797px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Your Stats</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p33035500} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Icon4 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">12</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">LVL</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">2.8K</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">7D</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">Streak</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container27 />
      <Container30 />
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] h-[126px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.15)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[126px] items-start pb-px pt-[21px] px-[21px] relative w-full">
          <Container21 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2f2f7d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1867d200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p212a5280} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2add090} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29ba0200} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Navigation2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[102.094px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[102.094px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[51px] not-italic text-[16px] text-center text-nowrap text-white top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Listen Live</p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-px relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Icon5 />
      <Navigation2 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[355.5px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[26.5px] h-[355.5px] items-start pb-px pt-[32px] px-[32px] relative w-[319px]">
        <Button19 />
        <Container32 />
        <Button20 />
      </div>
    </div>
  );
}

function Navigation3() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Nightlife</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[44.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[44.875px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[22px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIVE</p>
      </div>
    </div>
  );
}

function Navigation4() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon6 />
      <Container34 />
      <Text1 />
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p373a5680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 4.16667V5.83333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 14.1667V15.8333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 9.16667V10.8333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Tickets</p>
      </div>
    </div>
  );
}

function Navigation5() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon7 />
      <Container35 />
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-black text-nowrap top-px tracking-[0.3px] uppercase whitespace-pre">Night Pulse</p>
      </div>
    </div>
  );
}

function Navigation6() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon8 />
      <Container36 />
    </div>
  );
}

function Button23() {
  return (
    <div className="bg-white h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation6 />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Connect</p>
      </div>
    </div>
  );
}

function Navigation7() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon9 />
      <Container37 />
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[202px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[230px] relative shrink-0 w-full" data-name="Container">
      <Navigation3 />
      <Navigation8 />
    </div>
  );
}

function Navigation9() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Commerce</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p20f4ecf0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10 18.3333V10" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2eca8c80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M6.25 3.55833L13.75 7.85" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">MessMarket</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[69.273px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[69.273px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[35px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIMITED</p>
      </div>
    </div>
  );
}

function Navigation10() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon10 />
      <Container39 />
      <Text2 />
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation10 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2f53ac80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2.58583 5.02833H17.4142" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.pc159980} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Shop</p>
      </div>
    </div>
  );
}

function Navigation11() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon11 />
      <Container40 />
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation11 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[98px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button25 />
      <Button26 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[126px] relative shrink-0 w-full" data-name="Container">
      <Navigation9 />
      <Navigation12 />
    </div>
  );
}

function Navigation13() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Music</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.pe8d3820} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p32145100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[46.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[46.219px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[23px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">NEW</p>
      </div>
    </div>
  );
}

function Navigation14() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon12 />
      <Container42 />
      <Text3 />
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation14 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pc457480} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p21813b80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p388b6270} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2cb45c00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p25499600} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Radio</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[44.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[44.875px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[22px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIVE</p>
      </div>
    </div>
  );
}

function Navigation15() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon13 />
      <Container43 />
      <Text4 />
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation15 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[98px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button27 />
      <Button28 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[126px] relative shrink-0 w-full" data-name="Container">
      <Navigation13 />
      <Navigation16 />
    </div>
  );
}

function Navigation17() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Community</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pda9d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Care</p>
      </div>
    </div>
  );
}

function Navigation18() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon14 />
      <Container45 />
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Community</p>
      </div>
    </div>
  );
}

function Navigation19() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon15 />
      <Container46 />
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation19 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pda9d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Hand N Hand</p>
      </div>
    </div>
  );
}

function Navigation20() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon16 />
      <Container47 />
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation20 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[150px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[178px] relative shrink-0 w-full" data-name="Container">
      <Navigation17 />
      <Navigation21 />
    </div>
  );
}

function Navigation22() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Account</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p373a5680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 4.16667V5.83333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 14.1667V15.8333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 9.16667V10.8333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">My Tickets</p>
      </div>
    </div>
  );
}

function Navigation23() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon17 />
      <Container49 />
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation23 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Account</p>
      </div>
    </div>
  );
}

function Navigation24() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon18 />
      <Container50 />
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation24 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container51() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">XP Profile</p>
      </div>
    </div>
  );
}

function Navigation25() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon19 />
      <Container51 />
    </div>
  );
}

function Button34() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation25 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container52() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Settings</p>
      </div>
    </div>
  );
}

function Navigation26() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon20 />
      <Container52 />
    </div>
  );
}

function Button35() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation26 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p14ca9100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M17.5 10H7.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p38966ca0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Logout</p>
      </div>
    </div>
  );
}

function Navigation27() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon21 />
      <Container53 />
    </div>
  );
}

function Button36() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation27 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[254px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button32 />
      <Button33 />
      <Button34 />
      <Button35 />
      <Button36 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[282px] relative shrink-0 w-full" data-name="Container">
      <Navigation22 />
      <Navigation28 />
    </div>
  );
}

function Navigation29() {
  return (
    <div className="absolute h-[16px] left-[4px] top-0 w-[263px]" data-name="Navigation">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Admin</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container55() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">RAW Manager</p>
      </div>
    </div>
  );
}

function Navigation30() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon22 />
      <Container55 />
    </div>
  );
}

function Button37() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation30 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container56() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Admin</p>
      </div>
    </div>
  );
}

function Navigation31() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon23 />
      <Container56 />
    </div>
  );
}

function Button38() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation31 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Moderation</p>
      </div>
    </div>
  );
}

function Navigation32() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon24 />
      <Container57 />
    </div>
  );
}

function Button39() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation32 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Navigation33() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon25 />
      <Container58 />
    </div>
  );
}

function Button40() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation33 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container59() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">3D Globe View</p>
      </div>
    </div>
  );
}

function Navigation34() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon26 />
      <Container59 />
    </div>
  );
}

function Button41() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation34 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Market Sellers</p>
      </div>
    </div>
  );
}

function Navigation35() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon27 />
      <Container60 />
    </div>
  );
}

function Button42() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation35 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container61() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Navigation36() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon28 />
      <Container61 />
    </div>
  );
}

function Button43() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation36 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records Releases</p>
      </div>
    </div>
  );
}

function Navigation37() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon29 />
      <Container62 />
    </div>
  );
}

function Button44() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation37 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container63() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records Release</p>
      </div>
    </div>
  );
}

function Navigation38() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon30 />
      <Container63 />
    </div>
  );
}

function Button45() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation38 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Upload MP3s and Covers</p>
      </div>
    </div>
  );
}

function Navigation39() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon31 />
      <Container64 />
    </div>
  );
}

function Button46() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation39 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Orders</p>
      </div>
    </div>
  );
}

function Navigation40() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon32 />
      <Container65 />
    </div>
  );
}

function Button47() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation40 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">New Order</p>
      </div>
    </div>
  );
}

function Navigation41() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon33 />
      <Container66 />
    </div>
  );
}

function Button48() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation41 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Products</p>
      </div>
    </div>
  );
}

function Navigation42() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon34 />
      <Container67 />
    </div>
  );
}

function Button49() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation42 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Vendors</p>
      </div>
    </div>
  );
}

function Navigation43() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon35 />
      <Container68 />
    </div>
  );
}

function Button50() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation43 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Users</p>
      </div>
    </div>
  );
}

function Navigation44() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon36 />
      <Container69 />
    </div>
  );
}

function Button51() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation44 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Reports</p>
      </div>
    </div>
  );
}

function Navigation45() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon37 />
      <Container70 />
    </div>
  );
}

function Button52() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation45 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container71() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Content</p>
      </div>
    </div>
  );
}

function Navigation46() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon38 />
      <Container71 />
    </div>
  );
}

function Button53() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation46 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">DSAR</p>
      </div>
    </div>
  );
}

function Navigation47() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon39 />
      <Container72 />
    </div>
  );
}

function Button54() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation47 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Audit Log</p>
      </div>
    </div>
  );
}

function Navigation48() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon40 />
      <Container73 />
    </div>
  );
}

function Button55() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation48 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Overview</p>
      </div>
    </div>
  );
}

function Navigation49() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon41 />
      <Container74 />
    </div>
  );
}

function Button56() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation49 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M8.33333 10H11.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M8.33333 6.66667H11.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p16bb4600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b103700} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p24196980} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Club Mode</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[60.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[60.328px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[30px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">VENUE</p>
      </div>
    </div>
  );
}

function Navigation50() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon42 />
      <Container75 />
      <Text5 />
    </div>
  );
}

function Button57() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation50 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Navigation51() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[1086px] items-start left-0 top-[28px] w-[271px]" data-name="Navigation">
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
      <Button41 />
      <Button42 />
      <Button43 />
      <Button44 />
      <Button45 />
      <Button46 />
      <Button47 />
      <Button48 />
      <Button49 />
      <Button50 />
      <Button51 />
      <Button52 />
      <Button53 />
      <Button54 />
      <Button55 />
      <Button56 />
      <Button57 />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[1114px] relative shrink-0 w-full" data-name="Container">
      <Navigation29 />
      <Navigation51 />
    </div>
  );
}

function Navigation52() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[319px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[32px] h-full items-start overflow-clip pb-0 pt-[24px] px-[24px] relative rounded-[inherit] w-[319px]">
        <Container38 />
        <Container41 />
        <Container44 />
        <Container48 />
        <Container54 />
        <Container76 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[24px] left-[79.71px] top-[16px] w-[111.57px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[56px] not-italic text-[16px] text-black text-center text-nowrap top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Shop RAW →</p>
    </div>
  );
}

function Button58() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-full" data-name="Button">
      <Text6 />
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[105px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[105px] items-start pb-0 pt-[25px] px-[24px] relative w-[319px]">
        <Button58 />
      </div>
    </div>
  );
}

function Navigation53() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[666px] items-start left-0 pl-0 pr-px py-0 top-0 w-[320px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container33 />
      <Navigation52 />
      <Container77 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[22.398px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[22.4px] left-0 not-italic text-[14px] text-nowrap text-white top-[0.5px] tracking-[-0.2904px] whitespace-pre">HEAT INTENSITY</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-[#ff1694] relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[144.758px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-[144.758px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">High Activity (100+ scans)</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex gap-[12px] h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <Container78 />
      <Text7 />
    </div>
  );
}

function Container80() {
  return (
    <div className="bg-[#ff0080] relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">Medium Activity (10-99 scans)</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex gap-[12px] h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <Container80 />
      <Text8 />
    </div>
  );
}

function Container82() {
  return (
    <div className="bg-[#e70f3c] relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[18px] relative shrink-0 w-[132.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-[132.125px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">Low Activity (1-9 scans)</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex gap-[12px] h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <Container82 />
      <Text9 />
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <Container79 />
      <Container81 />
      <Container83 />
    </div>
  );
}

function NightPulse1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[12px] h-[138.398px] items-start left-[16px] pb-px pt-[17px] px-[17px] top-[96px] w-[230.977px]" data-name="NightPulse">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph7 />
      <Container84 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[22.398px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[22.4px] left-0 not-italic text-[14px] text-nowrap text-white top-[0.5px] tracking-[-0.2904px] whitespace-pre">CONTROLS</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[8.72px] top-[2px] w-[26.133px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap tracking-[-0.16px] whitespace-pre">Drag</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">•</p>
      <BoldText1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[34.85px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">to rotate globe</p>
    </div>
  );
}

function BoldText2() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[8.72px] top-[2px] w-[30.688px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap tracking-[-0.16px] whitespace-pre">Scroll</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">•</p>
      <BoldText2 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[39.41px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">to zoom in/out</p>
    </div>
  );
}

function BoldText3() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[8.72px] top-[2px] w-[27.039px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap tracking-[-0.16px] whitespace-pre">Click</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">•</p>
      <BoldText3 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[35.76px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">heat zone for details</p>
    </div>
  );
}

function BoldText4() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[8.72px] top-[2px] w-[37.352px]" data-name="Bold Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap tracking-[-0.16px] whitespace-pre">Switch</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">•</p>
      <BoldText4 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[46.07px] not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">time windows above</p>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[96px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function NightPulse2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] box-border content-stretch flex flex-col gap-[12px] h-[164.398px] items-start left-[890.36px] pb-px pt-[17px] px-[17px] top-[96px] w-[194.641px]" data-name="NightPulse">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph8 />
      <List />
    </div>
  );
}

function Container85() {
  return <div className="absolute bg-[#e70f3c] left-[-2.5px] opacity-[0.27] rounded-[1.67772e+07px] size-[84.995px] top-[-2.5px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white tracking-[0.6px] uppercase whitespace-pre">Scan Beacon</p>
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[42px] items-start left-0 pb-px pt-[15.5px] px-[17px] rounded-[4px] top-0 w-[132.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e70f3c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text10 />
    </div>
  );
}

function Container87() {
  return <div className="absolute border-[4px_4px_0px] border-[rgba(0,0,0,0)] border-solid h-[4px] left-[100.66px] top-[41px] w-[8px]" data-name="Container" />;
}

function ScanBeaconFab() {
  return (
    <div className="absolute h-[42px] left-[-52.66px] opacity-0 top-[-54px] w-[132.664px]" data-name="ScanBeaconFAB">
      <Container86 />
      <Container87 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p1d762100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p39e89df0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.pb10ef80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p3ef5cd00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M35 35V35.0167" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p3613af80} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M5 20H5.01667" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M20 5H20.0167" id="Vector_8" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M20 26.6667V26.6833" id="Vector_9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M26.6667 20H28.3333" id="Vector_10" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M35 20V20.0167" id="Vector_11" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d="M20 35V33.3333" id="Vector_12" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button59() {
  return (
    <div className="absolute bg-gradient-to-b from-[#e70f3c] left-[989px] rounded-[1.67772e+07px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-[80px] to-[rgba(0,0,0,0)] top-[554px]" data-name="Button">
      <Container85 />
      <ScanBeaconFab />
      <Icon43 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.41%_12.68%]" data-name="Vector">
        <div className="absolute inset-[-5.01%_-5.58%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
            <path d={svgPaths.p23f3d180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d={svgPaths.p1e531d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button60() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-start left-[1025px] pb-[2px] pt-[18px] px-[18px] size-[60px] top-[510px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Icon44 />
    </div>
  );
}

export default function ProjectStructureOverview() {
  return (
    <div className="bg-black relative size-full" data-name="Project Structure Overview">
      <AppContent />
      <Navigation53 />
      <NightPulse1 />
      <NightPulse2 />
      <Button59 />
      <Button60 />
    </div>
  );
}