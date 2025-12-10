import svgPaths from "./svg-xq6v88bogd";
import imgImageWithFallback from "figma:asset/6b6236b24fe19dd1c9fbb8377140e53b9fac005b.png";
import imgImageVoltage from "figma:asset/d9abca3a7009eaa1e3fa82a13b10fd718a060e06.png";
import imgImageHandNHandSunday from "figma:asset/c81e1e96a245e137f43a08439a8b3b3f137169c3.png";
import imgImageRawAfterhours from "figma:asset/e649e577369f5263fda71185a58f3a1a1b8a766f.png";
import imgImageMeshTankRaw from "figma:asset/a2f8ae65b78ae2405ff73a820957449bcdb6a1a8.png";
import imgImageLeatherHarness from "figma:asset/b76a2e04f7e0e22f092e8e7462826e7a01fdca59.png";
import imgImageGraphicCropTee from "figma:asset/30249ee7696b1826279eb688ca73f5e2f287ba07.png";
import imgImageDesignerBriefSet from "figma:asset/f0e9fea5c4e8a363dead2d686cdc53aff82d1a85.png";
import imgImageWithFallback1 from "figma:asset/41a0765c8f16b43b5a16161547f82a09a9a64297.png";
import imgImageWithFallback2 from "figma:asset/84780c6c0f26710ae5c59641fbd8cfb9b982bf8e.png";

function ImageWithFallback() {
  return (
    <div className="absolute h-[666px] left-0 top-0 w-[781px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container() {
  return <div className="absolute bg-gradient-to-t from-[#000000] h-[666px] left-0 to-[rgba(0,0,0,0.4)] top-0 via-50% via-[rgba(0,0,0,0.7)] w-[781px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="absolute h-[666px] left-0 top-0 w-[781px]" data-name="Container">
      <ImageWithFallback />
      <Container />
    </div>
  );
}

function Heading() {
  return (
    <div className="font-['Inter:Bold',sans-serif] font-bold h-[129.594px] leading-[64.8px] not-italic relative shrink-0 text-[72px] text-nowrap text-white tracking-[-2.757px] uppercase w-full whitespace-pre" data-name="Heading 1">
      <p className="absolute left-0 top-px">HOTMESS</p>
      <p className="absolute left-0 top-[65.8px]">LONDON</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[32px] left-0 not-italic text-[24px] text-[rgba(255,255,255,0.7)] text-nowrap top-0 tracking-[-0.2897px] whitespace-pre">Men-only nightlife OS. Real connection. Real heat. 18+.</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[32px] left-[40px] top-[16px] w-[24.906px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[12px] not-italic text-[24px] text-center text-nowrap text-white top-0 tracking-[0.9703px] translate-x-[-50%] uppercase whitespace-pre">🌍</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[283.93px] size-[20px] top-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-gradient-to-b from-[#ff1694] h-[64px] left-0 shadow-[0px_0px_40px_0px_rgba(255,22,148,0.6)] to-[#ff0080] top-0 w-[343.93px]" data-name="Button">
      <Text />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[174.91px] not-italic text-[18px] text-center text-nowrap text-white top-[18px] tracking-[0.4605px] translate-x-[-50%] uppercase whitespace-pre">NIGHT PULSE GLOBE</p>
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[239.23px] size-[20px] top-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-white h-[64px] left-0 top-[80px] w-[299.227px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[134px] not-italic text-[18px] text-black text-center text-nowrap top-[18px] tracking-[0.4605px] translate-x-[-50%] uppercase whitespace-pre">Enter City Rooms</p>
      <Icon1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[144px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[369.594px] items-start left-[80px] top-[200.41px] w-[621px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Container2 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[666px] overflow-clip relative shrink-0 w-full" data-name="Section">
      <Container1 />
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#e70f3c] h-[32px] relative shrink-0 w-[4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[32px] w-[4px]" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[48px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-1.0884px] uppercase whitespace-pre">Tonight in London</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[16px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Heading1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.6195px] whitespace-pre">Live events. Real connections. Real XP.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[88px] items-start left-0 top-0 w-[470.289px]" data-name="Container">
      <Container5 />
      <Paragraph1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[70px] size-[16px] top-px" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[18px] left-[535px] top-[8px] w-[86px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[31.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">View All</p>
      <Icon2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[113px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container6 />
      <Button2 />
    </div>
  );
}

function ImageVoltage() {
  return (
    <div className="h-[137.742px] relative shrink-0 w-full" data-name="Image (VOLTAGE)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageVoltage} />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[137.742px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageVoltage />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[20px] text-nowrap text-white top-0 tracking-[-0.9492px] uppercase whitespace-pre">VOLTAGE</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1539e500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
          <path d={svgPaths.p37b99980} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[14.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[14.219px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] text-nowrap top-[0.5px] tracking-[-0.3104px] whitespace-pre">E1</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.664px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[135.664px]">
        <Icon3 />
        <Text1 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_796_2837)" id="Icon">
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
          <path d={svgPaths.pc012c00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
        </g>
        <defs>
          <clipPath id="clip0_796_2837">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[98.117px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[98.117px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.3104px] w-[99px]">Tonight • 23:00</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[135.664px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative w-[135.664px]">
        <Icon4 />
        <Text2 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[48px] items-start relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[88px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container11 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[0.5px] tracking-[-0.3104px] w-[48px]">+90 XP</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.039px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[71.039px]">
        <Icon5 />
        <Text3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[28px] relative shrink-0 w-[28.961px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[28px] relative w-[28.961px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.5995px] w-[29px]">£15</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[45px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container13 />
      <Text4 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[197px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] h-[197px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container12 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function EventCard() {
  return (
    <div className="absolute content-stretch flex flex-col h-[384.75px] items-start left-0 p-px top-0 w-[185.664px]" data-name="EventCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container8 />
      <Container15 />
    </div>
  );
}

function ImageHandNHandSunday() {
  return (
    <div className="h-[137.742px] relative shrink-0 w-full" data-name="Image (HAND N HAND Sunday)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageHandNHandSunday} />
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[137.742px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageHandNHandSunday />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[20px] text-white top-0 tracking-[-0.9492px] uppercase w-[133px]">HAND N HAND Sunday</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1539e500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
          <path d={svgPaths.p37b99980} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[61.523px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[61.523px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] text-nowrap top-[0.5px] tracking-[-0.3104px] whitespace-pre">The Glory</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.664px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[135.664px]">
        <Icon6 />
        <Text5 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_796_2837)" id="Icon">
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
          <path d={svgPaths.pc012c00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
        </g>
        <defs>
          <clipPath id="clip0_796_2837">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[95.836px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[95.836px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.3104px] w-[96px]">Tonight • 21:00</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[135.664px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative w-[135.664px]">
        <Icon7 />
        <Text6 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[48px] items-start relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[116px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container19 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[0.5px] tracking-[-0.3104px] w-[54px]">+100 XP</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[77.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[77.125px]">
        <Icon8 />
        <Text7 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[28px] relative shrink-0 w-[28.695px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[28px] relative w-[28.695px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.5995px] w-[29px]">£12</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[45px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container21 />
      <Text8 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[225px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] h-[225px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container20 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function EventCard1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[384.75px] items-start left-[217.66px] p-px top-0 w-[185.664px]" data-name="EventCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Container23 />
    </div>
  );
}

function ImageRawAfterhours() {
  return (
    <div className="h-[137.75px] relative shrink-0 w-full" data-name="Image (RAW Afterhours)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageRawAfterhours} />
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[137.75px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageRawAfterhours />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[20px] text-white top-0 tracking-[-0.9492px] uppercase w-[127px]">RAW Afterhours</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[13.242px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2b3dff80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.827637" />
          <path d={svgPaths.p1581d900} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.827637" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.3104px] w-[70px]">Dalston Superstore</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[135.672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative w-[135.672px]">
        <Icon9 />
        <Text9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_796_2837)" id="Icon">
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
          <path d={svgPaths.pc012c00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.875" />
        </g>
        <defs>
          <clipPath id="clip0_796_2837">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[98.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[98.164px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.5)] top-[0.5px] tracking-[-0.3104px] w-[99px]">Tonight • 20:00</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[135.672px]">
        <Icon10 />
        <Text10 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[68px] items-start relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[136px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Container27 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[0.5px] tracking-[-0.3104px] w-[48px]">+80 XP</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.063px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[20px] items-center relative w-[71.063px]">
        <Icon11 />
        <Text11 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[28px] relative shrink-0 w-[29.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[28px] relative w-[29.188px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-white top-0 tracking-[-0.5995px] w-[30px]">£10</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex h-[45px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container29 />
      <Text12 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[245px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] h-[245px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container28 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function EventCard2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[384.75px] items-start left-[435.33px] p-px top-0 w-[185.672px]" data-name="EventCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container24 />
      <Container31 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[384.75px] relative shrink-0 w-full" data-name="Container">
      <EventCard />
      <EventCard1 />
      <EventCard2 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] h-[545.75px] items-start relative shrink-0 w-full" data-name="Section">
      <Container7 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[#e70f3c] h-[32px] relative shrink-0 w-[4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[32px] w-[4px]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[48px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-1.0884px] uppercase whitespace-pre">City Drops</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[16px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Heading6 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.6195px] whitespace-pre">New releases. Limited. No restocks.</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[88px] items-start left-0 top-0 w-[282px]" data-name="Container">
      <Container34 />
      <Paragraph2 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[113.32px] size-[16px] top-px" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[18px] left-[491.68px] top-[8px] w-[129.32px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[53.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">Browse Drops</p>
      <Icon12 />
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[113px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container35 />
      <Button3 />
    </div>
  );
}

function ImageMeshTankRaw() {
  return (
    <div className="h-[135.25px] relative shrink-0 w-full" data-name="Image (Mesh Tank - RAW)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageMeshTankRaw} />
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[135.25px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageMeshTankRaw />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.5004px] uppercase w-[87px]">Mesh Tank - RAW</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.12px] whitespace-pre">@kinkymerch</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[60px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Paragraph3 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_796_2789)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_796_2789">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">2h</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[16px] relative shrink-0 w-[31.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[31.984px]">
        <Icon13 />
        <Text13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p216a6c0} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.7)] top-px tracking-[-0.16px] w-[23px]">+50</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[16px] relative shrink-0 w-[40.07px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[40.07px]">
        <Icon14 />
        <Text14 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[28.547px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[28.547px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.4725px] w-[29px]">£28</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.68px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[28.68px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-px tracking-[-0.16px] w-[29px]">8 left</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex h-[37px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Text15 />
      <Text16 />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[169px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] h-[169px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container38 />
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function DropCard() {
  return (
    <div className="[grid-area:1_/_1] place-self-stretch relative shrink-0" data-name="DropCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container37 />
          <Container43 />
        </div>
      </div>
    </div>
  );
}

function ImageLeatherHarness() {
  return (
    <div className="h-[135.25px] relative shrink-0 w-full" data-name="Image (Leather Harness)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageLeatherHarness} />
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[135.25px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageLeatherHarness />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.5004px] uppercase w-[64px]">Leather Harness</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.12px] whitespace-pre">@rawgear</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[60px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading7 />
      <Paragraph4 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_796_2789)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_796_2789">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text17() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">5h</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32.164px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[32.164px]">
        <Icon15 />
        <Text17 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p216a6c0} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.7)] top-px tracking-[-0.16px] w-[22px]">+75</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.227px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[39.227px]">
        <Icon16 />
        <Text18 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Container47 />
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[24px] relative shrink-0 w-[28.859px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[28.859px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.4725px] w-[29px]">£45</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.539px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[28.539px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-px tracking-[-0.16px] w-[29px]">3 left</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex h-[37px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Text19 />
      <Text20 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[169px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] h-[169px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container45 />
          <Container48 />
          <Container49 />
        </div>
      </div>
    </div>
  );
}

function DropCard1() {
  return (
    <div className="[grid-area:1_/_2] place-self-stretch relative shrink-0" data-name="DropCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container44 />
          <Container50 />
        </div>
      </div>
    </div>
  );
}

function ImageGraphicCropTee() {
  return (
    <div className="h-[135.25px] relative shrink-0 w-full" data-name="Image (Graphic Crop Tee)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageGraphicCropTee} />
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[135.25px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageGraphicCropTee />
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.5004px] uppercase w-[101px]">Graphic Crop Tee</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.12px] whitespace-pre">@hmcollective</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[60px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading8 />
      <Paragraph5 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_796_2789)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_796_2789">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">12h</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[16px] relative shrink-0 w-[37.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[37.391px]">
        <Icon17 />
        <Text21 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p216a6c0} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function Text22() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.7)] top-px tracking-[-0.16px] w-[23px]">+40</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[16px] relative shrink-0 w-[40.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[40.375px]">
        <Icon18 />
        <Text22 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[24px] relative shrink-0 w-[27.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[27.984px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.4725px] w-[28px]">£22</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[16px] relative shrink-0 w-[33.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[33.664px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-px tracking-[-0.16px] w-[34px]">12 left</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex h-[37px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Text23 />
      <Text24 />
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[169px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] h-[169px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container52 />
          <Container55 />
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function DropCard2() {
  return (
    <div className="[grid-area:1_/_3] place-self-stretch relative shrink-0" data-name="DropCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container51 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function ImageDesignerBriefSet() {
  return (
    <div className="h-[135.25px] relative shrink-0 w-full" data-name="Image (Designer Brief Set)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageDesignerBriefSet} />
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-neutral-900 content-stretch flex flex-col h-[135.25px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <ImageDesignerBriefSet />
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.5004px] uppercase w-[67px]">Designer Brief Set</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.12px] whitespace-pre">@brutaljewelry</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[60px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading9 />
      <Paragraph6 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_796_2789)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_796_2789">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text25() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-nowrap top-px tracking-[-0.16px] whitespace-pre">8h</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[32.406px]">
        <Icon19 />
        <Text25 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p216a6c0} id="Vector" stroke="var(--stroke-0, #E70F3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.7)] top-px tracking-[-0.16px] w-[23px]">+60</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[16px] relative shrink-0 w-[40.289px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] h-[16px] items-center relative w-[40.289px]">
        <Icon20 />
        <Text26 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container60 />
      <Container61 />
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[24px] relative shrink-0 w-[28.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[28.594px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.5px] tracking-[-0.4725px] w-[29px]">£35</p>
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[28.438px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-px tracking-[-0.16px] w-[29px]">5 left</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex h-[37px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Text27 />
      <Text28 />
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[169px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] h-[169px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container59 />
          <Container62 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function DropCard3() {
  return (
    <div className="[grid-area:1_/_4] place-self-stretch relative shrink-0" data-name="DropCard">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container58 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[306.25px] relative shrink-0 w-full" data-name="Container">
      <DropCard />
      <DropCard1 />
      <DropCard2 />
      <DropCard3 />
    </div>
  );
}

function Section2() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] h-[467.25px] items-start relative shrink-0 w-full" data-name="Section">
      <Container36 />
      <Container65 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="absolute h-[308px] left-px opacity-30 top-px w-[619px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p348d6940} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pa211780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3fb8ff80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1ae0c980} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p230c5e00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[48px] relative shrink-0 w-[363.281px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[48px] relative w-[363.281px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-1.0884px] uppercase whitespace-pre">HOTMESS Radio</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[48px] items-center left-0 top-0 w-[491px]" data-name="Container">
      <Icon21 />
      <Heading10 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[28px] left-0 top-[64px] w-[491px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.7492px] whitespace-pre">Live 24/7 — track IDs, set lists, HAND N HAND Sundays.</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[150.47px] size-[18px] top-[19px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p53dc700} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white h-[56px] left-0 top-[124px] w-[200.469px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[85.5px] not-italic text-[16px] text-black text-center text-nowrap top-[15.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Listen Now</p>
      <Icon22 />
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[180px] relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Paragraph7 />
      <Button4 />
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex flex-col from-[#000000] h-[308px] items-start left-px pb-0 pt-[64px] px-[64px] to-[rgba(0,0,0,0.8)] top-px via-50% via-[rgba(0,0,0,0.95)] w-[619px]" data-name="Container">
      <Container67 />
    </div>
  );
}

function Section3() {
  return (
    <div className="h-[310px] relative shrink-0 w-full" data-name="Section">
      <div className="h-[310px] overflow-clip relative rounded-[inherit] w-full">
        <ImageWithFallback1 />
        <Container68 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-white top-[0.5px] tracking-[-1.0884px] uppercase w-[124px]">HNH MESS</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="font-['Inter:Regular',sans-serif] font-normal h-[140px] leading-[28px] not-italic relative shrink-0 text-[20px] text-[rgba(255,255,255,0.7)] tracking-[-0.7492px] w-full" data-name="Paragraph">
      <p className="absolute left-0 top-0 w-[185px]">The stigma-smashing lube for men.</p>
      <p className="absolute left-0 top-[56px] w-[206px]">QR → Community Room + Aftercare + HAND N HAND</p>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[32px] size-[18px] top-[19px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p34cb3f80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3e575200} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1349b6a0} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pd690e80} id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-[141.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[56px] relative w-[141.5px]">
        <Icon23 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[86px] not-italic text-[16px] text-black text-center text-nowrap top-[15.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Scan</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[56px] relative shrink-0 w-[101.453px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[56px] items-center px-[33px] py-px relative w-[101.453px]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[0.4875px] uppercase whitespace-pre">Buy</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex gap-[16px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[348px] items-start left-[65px] top-[65px] w-[221.5px]" data-name="Container">
      <Heading11 />
      <Paragraph8 />
      <Container69 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="opacity-70 relative shrink-0 size-[219.5px]" data-name="ImageWithFallback">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-[219.5px]" />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute bg-neutral-900 left-[334.5px] size-[221.5px] top-[128.25px]" data-name="Container">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-[221.5px]">
        <ImageWithFallback2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Section4() {
  return (
    <div className="h-[478px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container70 />
      <Container71 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p16512100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[48px] relative shrink-0 w-[118.195px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[48px] relative w-[118.195px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-1.0884px] uppercase whitespace-pre">Care</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[48px] items-center left-[65px] top-[65px] w-[491px]" data-name="Container">
      <Icon24 />
      <Heading12 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[28px] left-[65px] top-[129px] w-[491px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.7492px] whitespace-pre">Private aftercare check-in. Men only.</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute border border-[rgba(255,255,255,0.1)] border-solid h-[56px] left-[65px] top-[189px] w-[201.57px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[100.5px] not-italic text-[16px] text-center text-nowrap text-white top-[14.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Open Check-In</p>
    </div>
  );
}

function Section5() {
  return (
    <div className="h-[310px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container72 />
      <Paragraph9 />
      <Button7 />
    </div>
  );
}

function Container73() {
  return (
    <div className="bg-[#e70f3c] h-[32px] relative shrink-0 w-[4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[32px] w-[4px]" />
    </div>
  );
}

function Heading13() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[48px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[48px] left-0 not-italic text-[48px] text-nowrap text-white top-[0.5px] tracking-[-1.0884px] uppercase whitespace-pre">Leaderboard</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[16px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Container73 />
      <Heading13 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.6)] text-nowrap top-0 tracking-[-0.6195px] whitespace-pre">Top men in London this month.</p>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[88px] items-start left-0 top-0 w-[344.094px]" data-name="Container">
      <Container74 />
      <Paragraph10 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[78.14px] size-[16px] top-px" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[18px] left-[526.86px] top-[8px] w-[94.141px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[35.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">View Full</p>
      <Icon25 />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[113px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container75 />
      <Button8 />
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[28px] relative shrink-0 w-[10.648px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[28px] items-start relative w-[10.648px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-nowrap text-white tracking-[-0.0897px] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-nowrap text-white top-0 tracking-[-0.6195px] whitespace-pre">@rave_king</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[0.6px] uppercase w-[61px]">Level 24</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[91.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[49.141px] items-start relative w-[91.844px]">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[163.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[42.68px] h-[49.141px] items-center pl-[18.672px] pr-0 py-0 relative w-[163.844px]">
        <Text29 />
        <Container77 />
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[60px] not-italic text-[20px] text-nowrap text-right text-white top-0 tracking-[-0.6492px] translate-x-[-100%] whitespace-pre">12,450</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-[59.76px] not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap text-right top-[0.5px] tracking-[0.6px] translate-x-[-100%] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[45.141px] relative shrink-0 w-[59.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[45.141px] items-start relative w-[59.438px]">
        <Paragraph13 />
        <Paragraph14 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[98.141px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[98.141px] items-center justify-between pb-px pt-0 px-[24px] relative w-full">
          <Container78 />
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[28px] relative shrink-0 w-[13.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[28px] items-start relative w-[13.664px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-nowrap text-white tracking-[-0.0897px] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-nowrap text-white top-0 tracking-[-0.6195px] whitespace-pre">@night_hawk</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[0.6px] uppercase w-[61px]">Level 23</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[106.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[49.141px] items-start relative w-[106.586px]">
        <Paragraph15 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[178.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[41.172px] h-[49.141px] items-center pl-[17.164px] pr-0 py-0 relative w-[178.586px]">
        <Text30 />
        <Container81 />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[57px] not-italic text-[20px] text-nowrap text-right text-white top-0 tracking-[-0.6492px] translate-x-[-100%] whitespace-pre">11,200</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-[56.42px] not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap text-right top-[0.5px] tracking-[0.6px] translate-x-[-100%] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container83() {
  return (
    <div className="h-[45.141px] relative shrink-0 w-[56.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[45.141px] items-start relative w-[56.102px]">
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[98.141px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[98.141px] items-center justify-between pb-px pt-0 px-[24px] relative w-full">
          <Container82 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[28px] relative shrink-0 w-[14.273px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[28px] items-start relative w-[14.273px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-nowrap text-white tracking-[-0.0897px] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-nowrap text-white top-0 tracking-[-0.6195px] whitespace-pre">@darkroom_dave</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[0.6px] uppercase w-[61px]">Level 22</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[138.602px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[49.141px] items-start relative w-[138.602px]">
        <Paragraph19 />
        <Paragraph20 />
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[210.602px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[40.867px] h-[49.141px] items-center pl-[16.859px] pr-0 py-0 relative w-[210.602px]">
        <Text31 />
        <Container85 />
      </div>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[60px] not-italic text-[20px] text-nowrap text-right text-white top-0 tracking-[-0.6492px] translate-x-[-100%] whitespace-pre">10,800</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-[60px] not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap text-right top-[0.5px] tracking-[0.6px] translate-x-[-100%] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="h-[45.141px] relative shrink-0 w-[59.68px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[45.141px] items-start relative w-[59.68px]">
        <Paragraph21 />
        <Paragraph22 />
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[98.141px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[98.141px] items-center justify-between pb-px pt-0 px-[24px] relative w-full">
          <Container86 />
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[28px] relative shrink-0 w-[14.602px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[28px] items-start relative w-[14.602px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.4)] text-center text-nowrap tracking-[-0.0897px] whitespace-pre">4</p>
      </div>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-nowrap text-white top-0 tracking-[-0.6195px] whitespace-pre">@toxic_energy</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[0.6px] uppercase w-[59px]">Level 21</p>
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[116.516px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[49.141px] items-start relative w-[116.516px]">
        <Paragraph23 />
        <Paragraph24 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[188.516px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[40.703px] h-[49.141px] items-center pl-[16.695px] pr-0 py-0 relative w-[188.516px]">
        <Text32 />
        <Container89 />
      </div>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[52px] not-italic text-[20px] text-nowrap text-right text-white top-0 tracking-[-0.6492px] translate-x-[-100%] whitespace-pre">9,600</p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-[51.61px] not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap text-right top-[0.5px] tracking-[0.6px] translate-x-[-100%] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[45.141px] relative shrink-0 w-[51.289px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[45.141px] items-start relative w-[51.289px]">
        <Paragraph25 />
        <Paragraph26 />
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="h-[98.141px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[98.141px] items-center justify-between pb-px pt-0 px-[24px] relative w-full">
          <Container90 />
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[28px] relative shrink-0 w-[14.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[28px] items-start relative w-[14.094px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-[rgba(255,255,255,0.4)] text-center text-nowrap tracking-[-0.0897px] whitespace-pre">5</p>
      </div>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-nowrap text-white top-0 tracking-[-0.6195px] whitespace-pre">@afterhours</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[0.6px] uppercase w-[61px]">Level 20</p>
    </div>
  );
}

function Container93() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[97px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] h-[49.141px] items-start relative w-[97px]">
        <Paragraph27 />
        <Paragraph28 />
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="h-[49.141px] relative shrink-0 w-[169px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[40.953px] h-[49.141px] items-center pl-[16.953px] pr-0 py-0 relative w-[169px]">
        <Text33 />
        <Container93 />
      </div>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[52px] not-italic text-[20px] text-nowrap text-right text-white top-0 tracking-[-0.6492px] translate-x-[-100%] whitespace-pre">8,900</p>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-[51.7px] not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap text-right top-[0.5px] tracking-[0.6px] translate-x-[-100%] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[45.141px] relative shrink-0 w-[51.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[45.141px] items-start relative w-[51.375px]">
        <Paragraph29 />
        <Paragraph30 />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="h-[97.141px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[97.141px] items-center justify-between px-[24px] py-0 relative w-full">
          <Container94 />
          <Container95 />
        </div>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[491.703px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[491.703px] items-start p-px relative w-full">
          <Container80 />
          <Container84 />
          <Container88 />
          <Container92 />
          <Container96 />
        </div>
      </div>
    </div>
  );
}

function Section6() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] h-[652.703px] items-start relative shrink-0 w-full" data-name="Section">
      <Container76 />
      <Container97 />
    </div>
  );
}

function Container98() {
  return (
    <div className="h-[3595.7px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[128px] h-[3595.7px] items-start pb-0 pt-[96px] px-[80px] relative w-full">
          <Section1 />
          <Section2 />
          <Section3 />
          <Section4 />
          <Section5 />
          <Section6 />
        </div>
      </div>
    </div>
  );
}

function Homepage() {
  return (
    <div className="bg-black content-stretch flex flex-col h-[4261.7px] items-start relative shrink-0 w-full" data-name="Homepage">
      <Section />
      <Container98 />
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

function Paragraph31() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.8)] top-px tracking-[-0.2904px] w-[601px]">{`Information and support options—not medical advice. If you're in immediate danger, contact local emergency services (UK: 999).`}</p>
    </div>
  );
}

function Container99() {
  return (
    <div className="h-[95.5px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[95.5px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Paragraph31 />
        </div>
      </div>
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">{`Trust & Safety`}</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[36.273px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[18px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Legal</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[85.844px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[43.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Accessibility</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[112.969px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[56px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Abuse Reporting</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[21px] left-0 top-[116px] w-[42.242px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">DMCA</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[21px] left-0 top-[145px] w-[84.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[42px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Sponsorship</p>
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[166px] relative shrink-0 w-full" data-name="Container">
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-0 top-0 w-[196.328px]" data-name="Container">
      <Heading14 />
      <Container100 />
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[15.398px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Black',sans-serif] font-black leading-[15.4px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[0.5496px] uppercase whitespace-pre">Quick Links</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[41.063px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[21.5px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">About</p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[21px] left-0 top-[29px] w-[37.945px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Press</p>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[21px] left-0 top-[58px] w-[31.734px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[16px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Care</p>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[21px] left-0 top-[87px] w-[53.258px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[27px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Affiliate</p>
    </div>
  );
}

function Container102() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function Container103() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[244.33px] top-0 w-[196.336px]" data-name="Container">
      <Heading15 />
      <Container102 />
    </div>
  );
}

function Heading16() {
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

function Button19() {
  return (
    <div className="absolute h-[21px] left-0 top-[33px] w-[135.227px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[68.5px] not-italic text-[14px] text-center text-nowrap text-white top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Hand N Hand (Care)</p>
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute h-[21px] left-0 top-[66px] w-[81.375px]" data-name="Button">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[41px] not-italic text-[14px] text-[rgba(255,255,255,0.6)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy Hub</p>
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[87px] relative shrink-0 w-full" data-name="Container">
      <Link />
      <Button19 />
      <Button20 />
    </div>
  );
}

function Container105() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[197.398px] items-start left-[488.66px] top-0 w-[196.328px]" data-name="Container">
      <Heading16 />
      <Container104 />
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[197.398px] relative shrink-0 w-full" data-name="Container">
      <Container101 />
      <Container103 />
      <Container105 />
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[21px] relative shrink-0 w-[243.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[21px] relative w-[243.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-0 tracking-[-0.3104px] whitespace-pre">© 2025 HOTMESS LONDON. 18+ only.</p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[21px] relative shrink-0 w-[38.938px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[21px] relative w-[38.938px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[19px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Terms</p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[21px] relative shrink-0 w-[45.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[21px] relative w-[45.992px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[23.5px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Privacy</p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[25px] not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-0 tracking-[-0.3104px] translate-x-[-50%] whitespace-pre">Cookies</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="h-[21px] relative shrink-0 w-[183.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] h-[21px] items-start relative w-[183.711px]">
        <Button21 />
        <Button22 />
        <Button23 />
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex h-[54px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container107 />
      <Container108 />
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[522.898px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[32px] h-[522.898px] items-start pb-0 pt-[48px] px-[48px] relative w-full">
          <Container99 />
          <Container106 />
          <Container109 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black content-stretch flex flex-col h-[523.898px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container110 />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[4785.6px] items-start left-0 pl-[320px] pr-0 py-0 top-0 w-[1101px]" data-name="AppContent">
      <Homepage />
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

function Container111() {
  return (
    <div className="h-[16px] relative shrink-0 w-[56.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[56.219px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[28.5px] not-italic text-[12px] text-[rgba(255,255,255,0.5)] text-center text-nowrap top-px tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LONDON</p>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="bg-[#e70f3c] relative shrink-0 size-[6px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid size-[6px]" />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[50px] w-[255px]" data-name="Navigation">
      <Container111 />
      <Container112 />
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Button">
      <Navigation />
      <Navigation1 />
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[16px] relative shrink-0 w-[81.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[16px] relative w-[81.797px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[0.6px] uppercase whitespace-pre">Your Stats</p>
      </div>
    </div>
  );
}

function Icon26() {
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

function Container113() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text34 />
      <Icon26 />
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">12</p>
    </div>
  );
}

function Container115() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">LVL</p>
    </div>
  );
}

function Container116() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container114 />
      <Container115 />
    </div>
  );
}

function Container117() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">2.8K</p>
    </div>
  );
}

function Container118() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">XP</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container117 />
      <Container118 />
    </div>
  );
}

function Container120() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[24px] text-nowrap text-white top-0 tracking-[-0.0897px] whitespace-pre">7D</p>
    </div>
  );
}

function Container121() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-px tracking-[-0.16px] uppercase whitespace-pre">Streak</p>
    </div>
  );
}

function Container122() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Container120 />
      <Container121 />
    </div>
  );
}

function Container123() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container116 />
      <Container119 />
      <Container122 />
    </div>
  );
}

function Container124() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] h-[126px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.15)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] h-[126px] items-start pb-px pt-[21px] px-[21px] relative w-full">
          <Container113 />
          <Container123 />
        </div>
      </div>
    </div>
  );
}

function Icon27() {
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[102.094px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[51px] not-italic text-[16px] text-center text-nowrap text-white top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Listen Live</p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="content-stretch flex gap-[8px] h-[56px] items-center justify-center p-px relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Icon27 />
      <Navigation2 />
    </div>
  );
}

function Container125() {
  return (
    <div className="h-[355.5px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[26.5px] h-[355.5px] items-start pb-px pt-[32px] px-[32px] relative w-[319px]">
        <Button24 />
        <Container124 />
        <Button25 />
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

function Icon28() {
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

function Container126() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[44.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[44.875px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[22px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIVE</p>
      </div>
    </div>
  );
}

function Navigation4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon28 />
      <Container126 />
      <Text35 />
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation4 />
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
          <path d={svgPaths.p373a5680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 4.16667V5.83333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 14.1667V15.8333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 9.16667V10.8333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container127() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Tickets</p>
      </div>
    </div>
  );
}

function Navigation5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon29 />
      <Container127 />
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation5 />
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
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container128() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Night Pulse</p>
      </div>
    </div>
  );
}

function Navigation6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon30 />
      <Container128 />
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation6 />
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
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container129() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Connect</p>
      </div>
    </div>
  );
}

function Navigation7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon31 />
      <Container129 />
    </div>
  );
}

function Button29() {
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
      <Button26 />
      <Button27 />
      <Button28 />
      <Button29 />
    </div>
  );
}

function Container130() {
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

function Icon32() {
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

function Container131() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">MessMarket</p>
      </div>
    </div>
  );
}

function Text36() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[69.273px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[69.273px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[35px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIMITED</p>
      </div>
    </div>
  );
}

function Navigation10() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon32 />
      <Container131 />
      <Text36 />
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation10 />
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
          <path d={svgPaths.p2f53ac80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2.58583 5.02833H17.4142" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.pc159980} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container132() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Shop</p>
      </div>
    </div>
  );
}

function Navigation11() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon33 />
      <Container132 />
    </div>
  );
}

function Button31() {
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
      <Button30 />
      <Button31 />
    </div>
  );
}

function Container133() {
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

function Icon34() {
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

function Container134() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[46.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[46.219px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[23px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">NEW</p>
      </div>
    </div>
  );
}

function Navigation14() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon34 />
      <Container134 />
      <Text37 />
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation14 />
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

function Container135() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Radio</p>
      </div>
    </div>
  );
}

function Text38() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[44.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[44.875px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[22px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">LIVE</p>
      </div>
    </div>
  );
}

function Navigation15() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon35 />
      <Container135 />
      <Text38 />
    </div>
  );
}

function Button33() {
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
      <Button32 />
      <Button33 />
    </div>
  );
}

function Container136() {
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

function Icon36() {
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

function Container137() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Care</p>
      </div>
    </div>
  );
}

function Navigation18() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon36 />
      <Container137 />
    </div>
  );
}

function Button34() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation18 />
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
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p166b7100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container138() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Community</p>
      </div>
    </div>
  );
}

function Navigation19() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon37 />
      <Container138 />
    </div>
  );
}

function Button35() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation19 />
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
          <path d={svgPaths.pda9d200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container139() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Hand N Hand</p>
      </div>
    </div>
  );
}

function Navigation20() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon38 />
      <Container139 />
    </div>
  );
}

function Button36() {
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
      <Button34 />
      <Button35 />
      <Button36 />
    </div>
  );
}

function Container140() {
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

function Icon39() {
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

function Container141() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">My Tickets</p>
      </div>
    </div>
  );
}

function Navigation23() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon39 />
      <Container141 />
    </div>
  );
}

function Button37() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation23 />
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
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container142() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Account</p>
      </div>
    </div>
  );
}

function Navigation24() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon40 />
      <Container142 />
    </div>
  );
}

function Button38() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation24 />
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
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container143() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">XP Profile</p>
      </div>
    </div>
  );
}

function Navigation25() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon41 />
      <Container143 />
    </div>
  );
}

function Button39() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation25 />
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

function Container144() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Settings</p>
      </div>
    </div>
  );
}

function Navigation26() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon42 />
      <Container144 />
    </div>
  );
}

function Button40() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation26 />
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
          <path d={svgPaths.p14ca9100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M17.5 10H7.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p38966ca0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Container145() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Logout</p>
      </div>
    </div>
  );
}

function Navigation27() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon43 />
      <Container145 />
    </div>
  );
}

function Button41() {
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
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
      <Button41 />
    </div>
  );
}

function Container146() {
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

function Icon44() {
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

function Container147() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">RAW Manager</p>
      </div>
    </div>
  );
}

function Navigation30() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon44 />
      <Container147 />
    </div>
  );
}

function Button42() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation30 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon45() {
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

function Container148() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Admin</p>
      </div>
    </div>
  );
}

function Navigation31() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon45 />
      <Container148 />
    </div>
  );
}

function Button43() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation31 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon46() {
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

function Container149() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Moderation</p>
      </div>
    </div>
  );
}

function Navigation32() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon46 />
      <Container149 />
    </div>
  );
}

function Button44() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation32 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon47() {
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

function Container150() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Beacons</p>
      </div>
    </div>
  );
}

function Navigation33() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon47 />
      <Container150 />
    </div>
  );
}

function Button45() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation33 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon48() {
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

function Container151() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">3D Globe View</p>
      </div>
    </div>
  );
}

function Navigation34() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon48 />
      <Container151 />
    </div>
  );
}

function Button46() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation34 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon49() {
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

function Container152() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Market Sellers</p>
      </div>
    </div>
  );
}

function Navigation35() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon49 />
      <Container152 />
    </div>
  );
}

function Button47() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation35 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon50() {
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

function Container153() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records</p>
      </div>
    </div>
  );
}

function Navigation36() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon50 />
      <Container153 />
    </div>
  );
}

function Button48() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation36 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon51() {
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

function Container154() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records Releases</p>
      </div>
    </div>
  );
}

function Navigation37() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon51 />
      <Container154 />
    </div>
  );
}

function Button49() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation37 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon52() {
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

function Container155() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Records Release</p>
      </div>
    </div>
  );
}

function Navigation38() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon52 />
      <Container155 />
    </div>
  );
}

function Button50() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation38 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon53() {
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

function Container156() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Upload MP3s and Covers</p>
      </div>
    </div>
  );
}

function Navigation39() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon53 />
      <Container156 />
    </div>
  );
}

function Button51() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation39 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon54() {
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

function Container157() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Orders</p>
      </div>
    </div>
  );
}

function Navigation40() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon54 />
      <Container157 />
    </div>
  );
}

function Button52() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation40 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon55() {
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

function Container158() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">New Order</p>
      </div>
    </div>
  );
}

function Navigation41() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon55 />
      <Container158 />
    </div>
  );
}

function Button53() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation41 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon56() {
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

function Container159() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Products</p>
      </div>
    </div>
  );
}

function Navigation42() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon56 />
      <Container159 />
    </div>
  );
}

function Button54() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation42 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon57() {
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

function Container160() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Vendors</p>
      </div>
    </div>
  );
}

function Navigation43() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon57 />
      <Container160 />
    </div>
  );
}

function Button55() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation43 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon58() {
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

function Container161() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Users</p>
      </div>
    </div>
  );
}

function Navigation44() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon58 />
      <Container161 />
    </div>
  );
}

function Button56() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation44 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon59() {
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

function Container162() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Reports</p>
      </div>
    </div>
  );
}

function Navigation45() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon59 />
      <Container162 />
    </div>
  );
}

function Button57() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation45 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon60() {
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

function Container163() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Content</p>
      </div>
    </div>
  );
}

function Navigation46() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon60 />
      <Container163 />
    </div>
  );
}

function Button58() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation46 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon61() {
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

function Container164() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">DSAR</p>
      </div>
    </div>
  );
}

function Navigation47() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon61 />
      <Container164 />
    </div>
  );
}

function Button59() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation47 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon62() {
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

function Container165() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Audit Log</p>
      </div>
    </div>
  );
}

function Navigation48() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon62 />
      <Container165 />
    </div>
  );
}

function Button60() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation48 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon63() {
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

function Container166() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Overview</p>
      </div>
    </div>
  );
}

function Navigation49() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon63 />
      <Container166 />
    </div>
  );
}

function Button61() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Button">
      <div className="h-[46px] overflow-clip relative rounded-[inherit] w-full">
        <Navigation49 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon64() {
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

function Container167() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[18px] relative w-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-nowrap text-white top-px tracking-[0.3px] uppercase whitespace-pre">Club Mode</p>
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="bg-[#e70f3c] h-[20px] relative shrink-0 w-[60.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[60.328px]">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[30px] not-italic text-[12px] text-center text-nowrap text-white top-[3px] tracking-[0.6px] translate-x-[-50%] uppercase whitespace-pre">VENUE</p>
      </div>
    </div>
  );
}

function Navigation50() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-px px-[16px] py-0 top-px w-[269px]" data-name="Navigation">
      <Icon64 />
      <Container167 />
      <Text39 />
    </div>
  );
}

function Button62() {
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
      <Button61 />
      <Button62 />
    </div>
  );
}

function Container168() {
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] h-full items-start overflow-clip pb-0 pt-[24px] px-[24px] relative rounded-[inherit] w-[319px]">
        <Container130 />
        <Container133 />
        <Container136 />
        <Container140 />
        <Container146 />
        <Container168 />
      </div>
    </div>
  );
}

function Text40() {
  return (
    <div className="absolute h-[24px] left-[79.71px] top-[16px] w-[111.57px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[56px] not-italic text-[16px] text-black text-center text-nowrap top-[-0.5px] tracking-[0.4875px] translate-x-[-50%] uppercase whitespace-pre">Shop RAW →</p>
    </div>
  );
}

function Button63() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-full" data-name="Button">
      <Text40 />
    </div>
  );
}

function Container169() {
  return (
    <div className="h-[105px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[105px] items-start pb-0 pt-[25px] px-[24px] relative w-[319px]">
        <Button63 />
      </div>
    </div>
  );
}

function Navigation53() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[666px] items-start left-0 pl-0 pr-px py-0 top-0 w-[320px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container125 />
      <Navigation52 />
      <Container169 />
    </div>
  );
}

function Container170() {
  return <div className="absolute bg-[#e70f3c] left-[-1.32px] opacity-[0.284] rounded-[1.67772e+07px] size-[82.631px] top-[-1.32px]" data-name="Container" />;
}

function Text41() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white tracking-[0.6px] uppercase whitespace-pre">Scan Beacon</p>
    </div>
  );
}

function Container171() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[42px] items-start left-0 pb-px pt-[15.5px] px-[17px] rounded-[4px] top-0 w-[132.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e70f3c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text41 />
    </div>
  );
}

function Container172() {
  return <div className="absolute border-[4px_4px_0px] border-[rgba(0,0,0,0)] border-solid h-[4px] left-[100.66px] top-[41px] w-[8px]" data-name="Container" />;
}

function ScanBeaconFab() {
  return (
    <div className="absolute h-[42px] left-[-52.66px] opacity-0 top-[-54px] w-[132.664px]" data-name="ScanBeaconFAB">
      <Container171 />
      <Container172 />
    </div>
  );
}

function Icon65() {
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

function Button64() {
  return (
    <div className="absolute bg-gradient-to-b from-[#e70f3c] left-[989px] rounded-[1.67772e+07px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-[80px] to-[rgba(0,0,0,0)] top-[554px]" data-name="Button">
      <Container170 />
      <ScanBeaconFab />
      <Icon65 />
    </div>
  );
}

function Icon66() {
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

function Button65() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-start left-[1025px] pb-[2px] pt-[18px] px-[18px] size-[60px] top-[510px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Icon66 />
    </div>
  );
}

export default function Hm() {
  return (
    <div className="bg-black relative size-full" data-name="HM1">
      <AppContent />
      <Navigation53 />
      <Button64 />
      <Button65 />
    </div>
  );
}