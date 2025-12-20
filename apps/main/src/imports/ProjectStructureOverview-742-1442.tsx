import svgPaths from "./svg-prdd6b2s2m";

function Button() {
  return (
    <div className="bg-[#e7000b] h-[35.5px] relative rounded-[10px] shrink-0 w-[58.227px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[35.5px] relative w-[58.227px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[29px] not-italic text-[13px] text-center text-nowrap text-white top-[9px] tracking-[0.5738px] translate-x-[-50%] uppercase whitespace-pre">all</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[35.5px] relative rounded-[10px] shrink-0 w-[83.117px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[35.5px] relative w-[83.117px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[42.5px] not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[9px] tracking-[0.5738px] translate-x-[-50%] uppercase whitespace-pre">active</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[35.5px] relative rounded-[10px] shrink-0 w-[88.469px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[35.5px] relative w-[88.469px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.5px] not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[9px] tracking-[0.5738px] translate-x-[-50%] uppercase whitespace-pre">paused</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0.05)] grow h-[35.5px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[35.5px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[46.5px] not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-[9px] tracking-[0.5738px] translate-x-[-50%] uppercase whitespace-pre">expired</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[35.5px] relative shrink-0 w-[346.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[35.5px] items-start relative w-[346.016px]">
        <Button />
        <Button1 />
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Container1() {
  return <div className="[grid-area:1_/_1] bg-white place-self-stretch rounded-[3.6px] shrink-0" data-name="Container" />;
}

function Container2() {
  return <div className="[grid-area:1_/_2] bg-white place-self-stretch rounded-[3.6px] shrink-0" data-name="Container" />;
}

function Container3() {
  return <div className="[grid-area:2_/_1] bg-white place-self-stretch rounded-[3.6px] shrink-0" data-name="Container" />;
}

function Container4() {
  return <div className="[grid-area:2_/_2] bg-white place-self-stretch rounded-[3.6px] shrink-0" data-name="Container" />;
}

function Container5() {
  return (
    <div className="gap-[4px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[16px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#e7000b] h-[36px] relative rounded-[10px] shrink-0 w-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start pb-0 pt-[10px] px-[8px] relative w-[32px]">
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return <div className="bg-[rgba(255,255,255,0.6)] h-[4px] rounded-[3.6px] shrink-0 w-full" data-name="Container" />;
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      {[...Array(3).keys()].map((_, i) => (
        <Container6 key={i} />
      ))}
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0.05)] grow h-[36px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start pb-0 pt-[8px] px-[8px] relative w-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[36px] relative shrink-0 w-[80px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-start relative w-[80px]">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[85px] items-start left-0 pb-px pt-[24px] px-[24px] top-[476.19px] w-[781px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container9 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[334.5px] size-[64px] top-[80px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d={svgPaths.p1f1ede00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d={svgPaths.p14ca9680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d={svgPaths.p256c5480} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d={svgPaths.pd6da340} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M56 56V56.0267" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d={svgPaths.p15fd1a80} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M8 32H8.02667" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M32 8H32.0267" id="Vector_8" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M32 42.6667V42.6933" id="Vector_9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M42.6667 32H45.3333" id="Vector_10" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M56 32V32.0267" id="Vector_11" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
          <path d="M32 56V53.3333" id="Vector_12" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[22px] left-0 top-[160px] w-[733px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[22px] left-[367.15px] not-italic text-[20px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.8492px] translate-x-[-50%] whitespace-pre">No beacons found</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[190px] w-[733px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.4px] left-[367.05px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[0.5px] tracking-[-0.2904px] translate-x-[-50%] whitespace-pre">Create your first beacon to get started</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[292.398px] left-[24px] top-[593.19px] w-[733px]" data-name="Container">
      <Icon />
      <Heading2 />
      <Paragraph />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[129.594px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[64.8px] left-0 not-italic text-[72px] text-white top-px tracking-[-2.757px] uppercase w-[475px]">Beacon Management</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[25.594px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[16px] text-[rgba(255,255,255,0.6)] text-nowrap top-[-1px] tracking-[-0.4725px] whitespace-pre">Create, manage, and track your QR beacons across the platform</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[163.188px] relative shrink-0 w-[585.797px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[163.188px] items-start relative w-[585.797px]">
        <Heading />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.109px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.14779 7.55469H11.9616" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25911" />
          <path d="M7.55469 3.14779V11.9616" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25911" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[42.21px] not-italic text-[16px] text-center text-white top-[-0.5px] tracking-[-0.4725px] translate-x-[-50%] w-[57px]">Create Beacon</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#e7000b] h-[72px] relative rounded-[10px] shrink-0 w-[147.203px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[72px] items-center px-[20px] py-0 relative w-[147.203px]">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[163.188px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Button6 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[17.523px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pf755800} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d={svgPaths.p199970} id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d={svgPaths.p42d3ef0} id="Vector_3" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d={svgPaths.p3c149780} id="Vector_4" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M15.333 15.333V15.3403" id="Vector_5" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d={svgPaths.p2cd89e00} id="Vector_6" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M2.19043 8.76172H2.19773" id="Vector_7" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M8.76172 2.19043H8.76902" id="Vector_8" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M8.76172 11.6823V11.6896" id="Vector_9" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M11.6823 8.76172H12.4124" id="Vector_10" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M15.333 8.76172V8.76902" id="Vector_11" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
          <path d="M8.76172 15.333V14.6029" id="Vector_12" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.46029" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] top-px tracking-[0.5738px] uppercase w-[66px]">Total Beacons</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[12px] h-[39px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon2 />
      <Text1 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[48px] left-0 not-italic text-[32px] text-nowrap text-white top-0 tracking-[0.2463px] whitespace-pre">0</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="[grid-area:1_/_1] bg-[rgba(255,255,255,0.02)] place-self-stretch relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-px pt-[21px] px-[21px] relative size-full">
          <Container14 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p216b000} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[48.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[48.969px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">Active</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[12px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon3 />
      <Text2 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[48px] left-0 not-italic text-[32px] text-nowrap text-white top-0 tracking-[0.2463px] whitespace-pre">0</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="[grid-area:1_/_2] bg-[rgba(255,255,255,0.02)] place-self-stretch relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-px pt-[21px] px-[21px] relative size-full">
          <Container17 />
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[94.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[94.813px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">Total Scans</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[12px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Text3 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[48px] left-0 not-italic text-[32px] text-nowrap text-white top-0 tracking-[0.2463px] whitespace-pre">0</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="[grid-area:1_/_3] bg-[rgba(255,255,255,0.02)] place-self-stretch relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-px pt-[21px] px-[21px] relative size-full">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[19.898px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_742_1455)" id="Icon">
          <path d={svgPaths.p1d925a40} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6582" />
          <path d={svgPaths.p2d0415c0} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6582" />
        </g>
        <defs>
          <clipPath id="clip0_742_1455">
            <rect fill="white" height="19.8984" width="19.8984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] top-px tracking-[0.5738px] uppercase w-[58px]">Avg / Beacon</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[12px] h-[39px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[48px] left-0 not-italic text-[32px] text-nowrap text-white top-0 tracking-[0.2463px] whitespace-pre">0</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="[grid-area:1_/_4] bg-[rgba(255,255,255,0.02)] place-self-stretch relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-px pt-[21px] px-[21px] relative size-full">
          <Container23 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[137px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container19 />
      <Container22 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[332.188px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[332.188px] items-start px-[24px] py-0 relative w-full">
          <Container13 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(70,8,9,0.2)] h-[476.188px] items-start left-0 pb-0 pt-[96px] px-0 to-[#000000] top-0 w-[781px]" data-name="Container">
      <Container27 />
    </div>
  );
}

function BeaconManagement() {
  return (
    <div className="bg-black h-[1045.59px] relative shrink-0 w-full" data-name="BeaconManagement">
      <Container10 />
      <Container11 />
      <Container28 />
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

function Paragraph2() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.8)] top-px tracking-[-0.2904px] w-[601px]">{`Information and support options—not medical advice. If you're in immediate danger, contact local emergency services (UK: 999).`}</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[95.5px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[95.5px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Paragraph2 />
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">{`Trust & Safety`}</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[36.273px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[18px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Legal</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[85.844px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[43.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Accessibility</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[112.969px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[56px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Abuse Reporting</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[21px] left-0 top-[116px] w-[42.242px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">DMCA</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[21px] left-0 top-[145px] w-[84.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[42px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Sponsorship</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[166px] relative shrink-0 w-full" data-name="Container">
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-0 top-0 w-[196.328px]" data-name="Container">
      <Heading3 />
      <Container30 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">Quick Links</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[41.063px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">About</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[37.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Press</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[31.734px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[16px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Care</p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[53.258px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[27px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Affiliate</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[244.33px] top-0 w-[196.336px]" data-name="Container">
      <Heading4 />
      <Container32 />
    </div>
  );
}

function Heading5() {
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

function Button17() {
  return (
    <div className="absolute h-[21px] left-0 top-[33px] w-[135.227px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[68.5px] not-italic text-[14px] text-center text-nowrap text-white top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Hand N Hand (Care)</p>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[21px] left-0 top-[66px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[87px] relative shrink-0 w-full" data-name="Container">
      <Link />
      <Button17 />
      <Button18 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[488.66px] top-0 w-[196.328px]" data-name="Container">
      <Heading5 />
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[197.398px] relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container33 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[21px] relative shrink-0 w-[243.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[243.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-0 tracking-[-0.3104px] whitespace-pre">© 2025 HOTMESS LONDON. 18+ only.</p>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[21px] relative shrink-0 w-[38.938px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[38.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Terms</p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[45.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[45.992px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[23.5px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy</p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[25px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Cookies</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[21px] relative shrink-0 w-[183.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] h-[21px] items-start relative w-[183.711px]">
        <Button19 />
        <Button20 />
        <Button21 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="box-border content-stretch flex h-[54px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[522.898px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[522.898px] items-start pb-0 pt-[48px] px-[48px] relative w-full">
          <Container29 />
          <Container36 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black box-border content-stretch flex flex-col h-[523.898px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container40 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[1569.48px] items-start left-0 pl-[320px] pr-0 py-0 top-0 w-[1101px]" data-name="AppContent">
      <BeaconManagement />
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

function Container41() {
  return (
    <div className="h-[16px] relative shrink-0 w-[56.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[56.219px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[28.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LONDON</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[#e70f3c] relative shrink-0 size-[6px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[6px]" />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[50px] w-[255px]" data-name="Navigation">
      <Container41 />
      <Container42 />
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Button">
      <Navigation />
      <Navigation1 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[81.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[81.797px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Your Stats</p>
      </div>
    </div>
  );
}

function Icon6() {
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

function Container43() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Icon6 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">12</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">LVL</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">2.8K</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">7D</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">Streak</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Container53() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Container49 />
      <Container52 />
    </div>
  );
}

function Container54() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] h-[126px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.15)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[126px] items-start pb-px pt-[21px] px-[21px] relative w-full">
          <Container43 />
          <Container53 />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
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

function Button23() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-px relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Icon7 />
      <Navigation2 />
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[355.5px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[26.5px] h-[355.5px] items-start pb-px pt-[32px] px-[32px] relative w-[319px]">
        <Button22 />
        <Container54 />
        <Button23 />
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

function Icon8() {
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

function Container56() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Text6() {
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
      <Icon8 />
      <Container56 />
      <Text6 />
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon9() {
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

function Container57() {
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
      <Icon9 />
      <Container57 />
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Night Pulse</p>
      </div>
    </div>
  );
}

function Navigation6() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon10 />
      <Container58 />
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation6 />
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
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container59() {
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
      <Icon11 />
      <Container59 />
    </div>
  );
}

function Button27() {
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
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container60() {
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

function Icon12() {
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

function Container61() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">MessMarket</p>
      </div>
    </div>
  );
}

function Text7() {
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
      <Icon12 />
      <Container61 />
      <Text7 />
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation10 />
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
          <path d={svgPaths.p2f53ac80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2.58583 5.02833H17.4142" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.pc159980} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
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
      <Icon13 />
      <Container62 />
    </div>
  );
}

function Button29() {
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
      <Button28 />
      <Button29 />
    </div>
  );
}

function Container63() {
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

function Icon14() {
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

function Container64() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Text8() {
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
      <Icon14 />
      <Container64 />
      <Text8 />
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation14 />
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

function Container65() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Radio</p>
      </div>
    </div>
  );
}

function Text9() {
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
      <Icon15 />
      <Container65 />
      <Text9 />
    </div>
  );
}

function Button31() {
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
      <Button30 />
      <Button31 />
    </div>
  );
}

function Container66() {
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

function Container67() {
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
      <Icon16 />
      <Container67 />
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon17() {
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

function Container68() {
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
      <Icon17 />
      <Container68 />
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation19 />
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
          <path d={svgPaths.pda9d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
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
      <Icon18 />
      <Container69 />
    </div>
  );
}

function Button34() {
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
      <Button32 />
      <Button33 />
      <Button34 />
    </div>
  );
}

function Container70() {
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

function Icon19() {
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

function Container71() {
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
      <Icon19 />
      <Container71 />
    </div>
  );
}

function Button35() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation23 />
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
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
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
      <Icon20 />
      <Container72 />
    </div>
  );
}

function Button36() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation24 />
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
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
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
      <Icon21 />
      <Container73 />
    </div>
  );
}

function Button37() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation25 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
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

function Container74() {
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
      <Icon22 />
      <Container74 />
    </div>
  );
}

function Button38() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation26 />
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
          <path d={svgPaths.p14ca9100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M17.5 10H7.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p38966ca0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
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
      <Icon23 />
      <Container75 />
    </div>
  );
}

function Button39() {
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
      <Button35 />
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function Container76() {
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

function Container77() {
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
      <Icon24 />
      <Container77 />
    </div>
  );
}

function Button40() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation30 />
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

function Container78() {
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
      <Icon25 />
      <Container78 />
    </div>
  );
}

function Button41() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation31 />
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

function Container79() {
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
      <Icon26 />
      <Container79 />
    </div>
  );
}

function Button42() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation32 />
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

function Container80() {
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
      <Icon27 />
      <Container80 />
    </div>
  );
}

function Button43() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation33 />
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

function Container81() {
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
      <Icon28 />
      <Container81 />
    </div>
  );
}

function Button44() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation34 />
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

function Container82() {
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
      <Icon29 />
      <Container82 />
    </div>
  );
}

function Button45() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation35 />
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

function Container83() {
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
      <Icon30 />
      <Container83 />
    </div>
  );
}

function Button46() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation36 />
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

function Container84() {
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
      <Icon31 />
      <Container84 />
    </div>
  );
}

function Button47() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation37 />
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

function Container85() {
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
      <Icon32 />
      <Container85 />
    </div>
  );
}

function Button48() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation38 />
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

function Container86() {
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
      <Icon33 />
      <Container86 />
    </div>
  );
}

function Button49() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation39 />
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

function Container87() {
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
      <Icon34 />
      <Container87 />
    </div>
  );
}

function Button50() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation40 />
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

function Container88() {
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
      <Icon35 />
      <Container88 />
    </div>
  );
}

function Button51() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation41 />
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

function Container89() {
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
      <Icon36 />
      <Container89 />
    </div>
  );
}

function Button52() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation42 />
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

function Container90() {
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
      <Icon37 />
      <Container90 />
    </div>
  );
}

function Button53() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation43 />
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

function Container91() {
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
      <Icon38 />
      <Container91 />
    </div>
  );
}

function Button54() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation44 />
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

function Container92() {
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
      <Icon39 />
      <Container92 />
    </div>
  );
}

function Button55() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation45 />
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

function Container93() {
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
      <Icon40 />
      <Container93 />
    </div>
  );
}

function Button56() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation46 />
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

function Container94() {
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
      <Icon41 />
      <Container94 />
    </div>
  );
}

function Button57() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation47 />
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
          <path d={svgPaths.p1f20b6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container95() {
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
      <Icon42 />
      <Container95 />
    </div>
  );
}

function Button58() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation48 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon43() {
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

function Container96() {
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
      <Icon43 />
      <Container96 />
    </div>
  );
}

function Button59() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation49 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon44() {
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

function Container97() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Club Mode</p>
      </div>
    </div>
  );
}

function Text10() {
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
      <Icon44 />
      <Container97 />
      <Text10 />
    </div>
  );
}

function Button60() {
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
      <Button58 />
      <Button59 />
      <Button60 />
    </div>
  );
}

function Container98() {
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[32px] h-full items-start overflow-clip relative rounded-[inherit] w-[319px]">
        <Container60 />
        <Container63 />
        <Container66 />
        <Container70 />
        <Container76 />
        <Container98 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[24px] left-[79.71px] top-[16px] w-[111.57px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[56px] not-italic text-[16px] text-black text-center text-nowrap top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Shop RAW →</p>
    </div>
  );
}

function Button61() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-full" data-name="Button">
      <Text11 />
    </div>
  );
}

function Container99() {
  return (
    <div className="h-[105px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[105px] items-start pb-0 pt-[25px] px-[24px] relative w-[319px]">
        <Button61 />
      </div>
    </div>
  );
}

function Navigation53() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[666px] items-start left-0 pl-0 pr-px py-0 top-0 w-[320px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container55 />
      <Navigation52 />
      <Container99 />
    </div>
  );
}

function Container100() {
  return <div className="absolute bg-[#e70f3c] left-[-9.18px] opacity-[0.162] rounded-[1.67772e+07px] size-[98.35px] top-[-9.18px]" data-name="Container" />;
}

function Text12() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white tracking-[0.6px] uppercase whitespace-pre">Scan Beacon</p>
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute bg-black box-border content-stretch flex flex-col h-[42px] items-start left-0 pb-px pt-[15.5px] px-[17px] rounded-[4px] top-0 w-[132.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e70f3c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text12 />
    </div>
  );
}

function Container102() {
  return <div className="absolute border-[4px_4px_0px] border-[rgba(0,0,0,0)] border-solid h-[4px] left-[100.66px] top-[41px] w-[8px]" data-name="Container" />;
}

function ScanBeaconFab() {
  return (
    <div className="absolute h-[42px] left-[-52.66px] opacity-0 top-[-54px] w-[132.664px]" data-name="ScanBeaconFAB">
      <Container101 />
      <Container102 />
    </div>
  );
}

function Icon45() {
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

function Button62() {
  return (
    <div className="absolute bg-gradient-to-b from-[#e70f3c] left-[989px] rounded-[1.67772e+07px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-[80px] to-[rgba(0,0,0,0)] top-[554px]" data-name="Button">
      <Container100 />
      <ScanBeaconFab />
      <Icon45 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.6497px] uppercase whitespace-pre">Create New Beacon</p>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[73px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[73px] items-start pb-px pt-[24px] px-[24px] relative w-full">
          <Heading1 />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">Beacon Type</p>
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">📍</p>
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Check-in</p>
    </div>
  );
}

function Button63() {
  return (
    <div className="absolute bg-[rgba(70,8,9,0.2)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-0 pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-0 w-[199.328px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#e7000b] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container104 />
      <Container105 />
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">🎉</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Event</p>
    </div>
  );
}

function Button64() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-[211.33px] pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-0 w-[199.336px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container106 />
      <Container107 />
    </div>
  );
}

function Container108() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">🎫</p>
    </div>
  );
}

function Container109() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Ticket</p>
    </div>
  );
}

function Button65() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-[422.66px] pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-0 w-[199.328px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container108 />
      <Container109 />
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">🛍️</p>
    </div>
  );
}

function Container111() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Product</p>
    </div>
  );
}

function Button66() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-0 pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-[111.5px] w-[199.328px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container110 />
      <Container111 />
    </div>
  );
}

function Container112() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">💎</p>
    </div>
  );
}

function Container113() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Drop</p>
    </div>
  );
}

function Button67() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-[211.33px] pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-[111.5px] w-[199.336px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container112 />
      <Container113 />
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">🏪</p>
    </div>
  );
}

function Container115() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-0 not-italic text-[13px] text-nowrap text-white top-px tracking-[-0.2362px] whitespace-pre">Vendor</p>
    </div>
  );
}

function Button68() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[8px] h-[99.5px] items-start left-[422.66px] pb-[2px] pt-[18px] px-[18px] rounded-[10px] top-[111.5px] w-[199.328px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container114 />
      <Container115 />
    </div>
  );
}

function Container116() {
  return (
    <div className="h-[211px] relative shrink-0 w-full" data-name="Container">
      <Button63 />
      <Button64 />
      <Button65 />
      <Button66 />
      <Button67 />
      <Button68 />
    </div>
  );
}

function Container117() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[242.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container116 />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">Beacon Name</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[50px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.3)] text-nowrap tracking-[-0.4725px] whitespace-pre">e.g., The Glory Check-in</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[77.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <TextInput />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">Description (Optional)</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[98px] relative rounded-[10px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[98px] items-start px-[16px] py-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.3)] text-nowrap tracking-[-0.4725px] whitespace-pre">Venue check-in beacon for earning XP and tracking attendance</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container119() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[131.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <TextArea />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] text-nowrap top-px tracking-[0.5738px] uppercase whitespace-pre">XP Reward</p>
    </div>
  );
}

function NumberInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="Number Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[50px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white tracking-[-0.4725px] whitespace-pre">10</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[-0.12px] w-[259px]">{`Default: 10 XP (will be multiplied by user's tier)`}</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[100.695px] items-start relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <NumberInput />
      <Paragraph3 />
    </div>
  );
}

function Button69() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0.05)] grow h-[48px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[152.88px] not-italic text-[16px] text-center text-nowrap text-white top-[11.5px] tracking-[-0.4725px] translate-x-[-50%] whitespace-pre">Cancel</p>
      </div>
    </div>
  );
}

function Button70() {
  return (
    <div className="basis-0 bg-[#e7000b] grow h-[48px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[152.84px] not-italic text-[16px] text-center text-nowrap text-white top-[11.5px] tracking-[-0.4725px] translate-x-[-50%] whitespace-pre">Create Beacon</p>
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="box-border content-stretch flex gap-[12px] h-[65px] items-start pb-0 pt-[17px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Button69 />
      <Button70 />
    </div>
  );
}

function Form() {
  return (
    <div className="h-[761.195px] relative shrink-0 w-full" data-name="Form">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[761.195px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container117 />
          <Container118 />
          <Container119 />
          <Container120 />
          <Container121 />
        </div>
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="bg-zinc-950 h-[599.398px] relative rounded-[10px] shrink-0 w-[672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[599.398px] items-start overflow-clip p-px relative rounded-[inherit] w-[672px]">
        <Container103 />
        <Form />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function CreateBeaconModal() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] content-stretch flex h-[666px] items-center justify-center left-0 top-0 w-[1101px]" data-name="CreateBeaconModal">
      <Container122 />
    </div>
  );
}

function Icon46() {
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

function Button71() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-start left-[1025px] pb-[2px] pt-[18px] px-[18px] size-[60px] top-[510px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Icon46 />
    </div>
  );
}

export default function ProjectStructureOverview() {
  return (
    <div className="bg-black relative size-full" data-name="Project Structure Overview">
      <AppContent />
      <Navigation53 />
      <Button62 />
      <CreateBeaconModal />
      <Button71 />
    </div>
  );
}