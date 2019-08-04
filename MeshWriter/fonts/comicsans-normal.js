//  COMIC SANS MS  COMIC SANS MS  COMIC SANS MS
// 

define(
  [],
  function(){

    return function(codeList){

      var font={reverseHoles:false,reverseShapes:true},nbsp=' ';

      font["a"]        = {
        sC             : [
                           'HD@¤ H1@¤G¤A, GUATG?At FbAAE½A& ES@°E"@° C>@°BVA± AtBªAtD¤ AtFnB¹G¸ D8I=E½I= FpI=GYH´ H^HZH^G° H^GtHJG_ H@G9H;Fe H5E²H4D® H3C´HECK HOBÃH¥AÂ H¬A±H¼Al HÂA[ HÂA4H¦@½ Hi@¤HD@¤'
                         ],
        hC             : [
                           ['FzF( FzFRF¡F¦ F§G4F±Gm FkG¢FPGª F6G³F&G³ D²G³D!F¸ C4E¼C4Dy C4CXCmB« D$B8D¹B8 EuB8F5BZ FYBmF»C# FzE&FzF(']
                         ],
        xMin           : 24.5,
        xMax           : 494.5,
        yMin           : -32.5,
        yMax           : 509.5,
        wdth           : 511.5
      };
      font["á"]        = supplement(font.a,"acute",100,0);
      font["à"]        = supplement(font.a,"grave",130,-17);
      font["ä"]        = supplement(font.a,"dieresis",-24,8);
      font["â"]        = supplement(font.a,"circumflex",-9,0);
      font["å"]        = supplement(font.a,"ring",-10,-10);
      font["æ"]        = {
        sC             : [
                           'GUAw G,AOFfA1 E¾@µEa@µ C°@µB©AÄ A¦C-A¦D¦ A¦FiC2G± D^I1FDI1 G)I1H0H¤ HPHxHVG¶ H°HdIpHµ JKI>K,I> LII>M/H­ N3HFN3G8 N3FUMAE§ L¶EdKwD¼ H£Ci IoBEKGBE K¹BELmBa MRB¢MzC3 MÃChNACh NdChN¡CN N»C4N»Bµ N»AÃMbAS LK@¸KG@¸ Ie@¸H}A¦ H£ApH¨AA H¬@»H:@» G©@»GrA2 GeAAGUAw'
                         ],
        hC             : [
                           ['K,G± I=G±HqD¿ J°EÁ L6FoL»G@ LDG±K,G±','GEGk F¤G¯ FoG¶F5G¶ D¾G¶D,F³ CBE·CBDx CBC}C¹B» DpB0EiB0 F*B0FbBI F»BcGEB¶ G/C²G/D8 G/FJGEGk']
                         ],
        xMin           : 32.5,
        xMax           : 875,
        yMin           : -24,
        yMax           : 510,
        wdth           : 911.5
      };
      font["b"]        = {
        sC             : [
                           'E´@» D}@»C¥AS CdA#C6A# B´A#BxA> B^AXB^A¢ B^A»B`BJ BcB}BcB¸ BcC~B]EK BWF½BWG¥ BWHIBXI³ BYKVBYKÂ BYLYBrL« BµMDCJMD C¶MDC¶Lp C¶LbC²LG C­L,C­KÂ CªJI C¨HP DZH¬E%I% EtICF6IC G«ICH®H! I©F­I©E. I©COHxB4 Gh@»E´@»'
                         ],
        hC             : [
                           ['F6G­ EgG­DµG^ DjGGC©F~ C§ET C¨D; C©B¾ D5B©D­Bf EFBRE´BR FÂBRG{C6 HUC¼HUE. HUF?G®FÄ G<G­F6G­']
                         ],
        xMin           : 74.5,
        xMax           : 546,
        yMin           : -21,
        yMax           : 769,
        wdth           : 593
      };
      font["c"]        = {
        sC             : [
                           'E¦@§ D:@§C5A~ B(B}B(DL B(EµC,Gf D>IPEwIP FVIPGLI" HbHjHbG¹ HbGrHIGT H0G7G¯G7 GqG7G[GH GFGYG2Gk FzG»EwG» DµG»D1Fg CXECCXDL CXCKD0B¤ D¥B<E¦B< F=B<F£B[ GrBº G±C&G¾C& H?C&HYB­ HuBnHuBH HuA¤G^A? FZ@§E¦@§'
                         ],
        xMin           : 51,
        xMax           : 473,
        yMin           : -31,
        yMax           : 519,
        wdth           : 513.5
      };
      font["ç"]        = {
        sC             : [
                           'G1?¥ G1>¬Fw>L F;=²EE=² Ds=²D(>. CJ>WCJ>Á CJ?SC°?S D0?SD]?; D¬?"E:?" Ek?#E¥?; E¼?QE¼?~ E¼@,Eu@Q EP@wD©@¶ CkA6B°B& B(BÂB(DL B(EµC,Gf D>IPEwIP FVIPGLI" HbHjHbG¹ HbGrHIGT H0G7G¯G7 GqG7G[GH GFGYG2Gk FzG»EwG» DµG»D1Fg CXECCXDL CXCKD0B¤ D¥B<E¦B< F=B<F£B[ GrBº G±C&G¾C& H?C&HYB­ HuBnHuBH HuAeF{@½ F¹@vG#@O G1@)G1?¥'
                         ],
        xMin           : 51,
        xMax           : 473,
        yMin           : -217.5,
        yMax           : 519,
        wdth           : 513.5
      };
      font["d"]        = {
        sC             : [
                           'IMGÃ IAF³IAE¤ IAC;I`A¸ IbA«IbA¢ IbAXIFA? I*A$H©A$ HJA$H-A~ GhAIF¾A/ FP@¸E¡@¸ D4@¸C/A¾ B%C$B%D~ B%F¥C0GÂ D:I<EºI< F«I<GFH¼ H!HV H/KrHBL¢ HOMVH¾MV IuMVIuLx IuKqIMGÃ'
                         ],
        hC             : [
                           ['E¾G© DxG©D$G$ CSFDCSD¤ CSC¦D,C( D©BME¡BM FPBMF«Bl G*B~GvC< G¦CIG´C[ G±D§ G²Ev G´Fi GmG7G/G` FrG©E¾G©']
                         ],
        xMin           : 50,
        xMax           : 537,
        yMin           : -22.5,
        yMax           : 778,
        wdth           : 587
      };
      font["e"]        = {
        sC             : [
                           'E´@¸ D5@¸C,A¦ A¹B~A¹DY A¹FWBµG¦ CºI>ExI> F¼I>G£Hª H¡HDH¡G8 H¡FWG²Eª G_EdF@D¼ CKCi C¥BºDSBo E$BEE´BE FUBEG/B` H"B¢HDC3 HfChH®Ch I-ChIHCN IdC4IdBµ IdB$H4AW FÂ@¸E´@¸'
                         ],
        hC             : [
                           ['ExG± D£G±D1G2 CcFVC;D¿ EgF+ FºF¤GcG@ F±G±ExG±']
                         ],
        xMin           : 42,
        xMax           : 528.5,
        yMin           : -22.5,
        yMax           : 510,
        wdth           : 547.5
      };
      font["é"]        = supplement(font.e,"acute",100,0);
      font["è"]        = supplement(font.e,"grave",130,0);
      font["ë"]        = supplement(font.e,"dieresis",24,0);
      font["ê"]        = supplement(font.e,"circumflex",0,0);
      font["f"]        = {
        sC             : [
                           'GYKÂ EnKÂEQIV ENH½ FuI%G$I% H@I%H@HD H@G~GuGp GSGjG%Gl F{GmEEG^ E=E¢ E=EBEADI EECPEEB· EEA[E0@t DÂ@$DU@$ D-@$C³@? Cu@YCu@£ Cu@«Cw@· C®A¶C®C( C«E3 C«GN B±GDBnGD A®GDA®H" A®H¦C6H« C¶H® C¹IBD!IÃ D;KyD²L` EvM[GMM[ HXM[HXL} HXKÂGYKÂ'
                         ],
        xMin           : 36.5,
        xMax           : 459,
        yMin           : -78.5,
        yMax           : 780.5,
        wdth           : 508
      };
      font["g"]        = {
        sC             : [
                           'HnDg HVAÁ HQ@[H.?` G¦>AG!=w F-<¾DO<¾ CM<¾Bv=, A{=EA{=µ A{>jBO>j Bs>jCD>X C¹>GD{>I F5>KF~?¡ G,@vG/Bm F{A®F1AZ EiA)D®A) CZA)BlB! A}B½A}D[ A}FcB¶G¦ D0I)F=I) F»I)GVHµ G¶H|H3HL H¿HIH¿GX H¿FµHªEÁ HrDºHnDg'
                         ],
        hC             : [
                           ['F3G° D{G°C·F° C:E½C:Di C:C[CpB¶ D$BLD³BL EtBLFPC; G#D!G/Dª GDEqG[GR G4GqF­G¢ FaG°F3G°']
                         ],
        xMin           : 28,
        xMax           : 493,
        yMin           : -275.5,
        yMax           : 499.5,
        wdth           : 530.5
      };
      font["h"]        = {
        sC             : [
                           'H|@¨ H5@¨GÃAO G¬AÂGxC3 GfD@GfD¾ GfE5GiEi GkE¿GkF5 GkGnF±Gn EµGnE1F~ D¢FCD(DÄ D(B-C¬Aj CnA,C4A, B¯A,BnAG BOAdBOA­ BOAºBXB5 BaBMBdCC BgDT BiJ! BpJ¾BpKE BpKxBgL" B^LOB^L¢ B^M(BzMC B¸M_C>M_ C²M_C¿L« D,L)D,K^ D,JxD$Iª CÂHÀCÃH1 CÄG[ DrHGELH} F(I1F±I1 H0I1HnHH H»G¡HÁFN I%D¶ I9CH IGBVIZA¢ I_AoI_Ad I_A;IA@Ã I#@¨H|@¨'
                         ],
        xMin           : 70.5,
        xMax           : 526,
        yMin           : -30.5,
        yMax           : 782,
        wdth           : 577.5
      };
      font["i"]        = {
        sC             : [
                           'D0D~ D0DBD3CN D7BYD7AÁ D7AtC¿AX C¥A=CWA= C-A=BµAX BxAtBxAÁ BxBYBuCN BqDBBqD~ BqEYB{Fc B§GlB§HG B§HtBÂH± C:I)CeI) C±I)D(H± DCHtDCHG DCGlD9Fc D0EYD0D~',
                           'C§J¹ CUJ¹C3K7 B´KXB´Kª B´L6C3LW CULyC§Ly D3LyDTLW DwL6DwKª DwKXDTK7 D3J¹C§J¹'
                         ],
        xMin           : 87,
        xMax           : 218,
        yMin           : -2.5,
        yMax           : 731,
        wdth           : 280
      };
      font["ı"]        = {
        sC             : [
                           'D0D~ D0DBD3CN D7BYD7AÁ D7AtC¿AX C¥A=CWA= C-A=BµAX BxAtBxAÁ BxBYBuCN BqDBBqD~ BqEYB{Fc B§GlB§HG B§HtBÂH± C:I)CeI) C±I)D(H± DCHtDCHG DCGlD9Fc D0EYD0D~'
                         ],
        xMin           : 87,
        xMax           : 218,
        yMin           : -2.5,
        yMax           : 730,
        wdth           : 280
      };
      font["í"]        = supplement(font["ı"],"acute",-20,0);
      font["ì"]        = supplement(font["ı"],"grave",-20,0);
      font["ï"]        = supplement(font["ı"],"dieresis",-120,0);
      font["î"]        = supplement(font["ı"],"circumflex",-60,0);
      font["j"]        = {
        sC             : [
                           'D¥?` D¦@QDbD( D?HB D?HtD[H¼ DxI?E!I? ECI?EeI& E©H±E«Hv F(DB FB?j FB>bEr=t D¼<{C¾<{ BI<{A<?> A0?XA0?n A0?·AO@0 An@LA¸@L BN@LB°?M B¿?,CC>o Cj>=C¾>= DF>=De>~ D}?.D¥?`',
                           'D­J¸ D[J¸D9K6 CºKWCºK¨ CºL4D9LU D[LwD­Lw E8LwE[LU E~L4E~K¨ E~KWE[K6 E8J¸D­J¸'
                         ],
        xMin           : -9,
        xMax           : 320,
        yMin           : -292,
        yMax           : 730,
        wdth           : 403
      };
      font["k"]        = {
        sC             : [
                           'Hx@¼ HA@¼H#AR GrB5F­C; E_E& E$D{D.D) D"BµD"A¥ D"AVC«A; Cn@ÂCC@Â Bb@ÂBbB# BbBvBmCº BxE8BxE¬ BxFÁB}H^ B£I¿B£K. B£KZB}K¹ BxLQBxL~ BxM)BµME C-MaCWMa C¤MaC¿ME D7M)D7L~ D7LPD;K¶ D@KVD@K) D9Hp D5GED7E¾ E;F¤F6G{ G°IW H-IzHSIz HzIzHºIZ I6I<I6H· I6HtH½HS H!GFFsF$ HGC¦ I]B7I]Az I]ARI>A6 HÂ@¼Hx@¼'
                         ],
        xMin           : 79.5,
        xMax           : 525,
        yMin           : -20.5,
        yMax           : 783,
        wdth           : 540
      };
      font["l"]        = {
        sC             : [
                           'DAGA D3C] D3B²D+Az CÄ@»CK@» Bl@»BlA| BlBrBwD_ B¤FKB¤GA B¤H[B©J! B®KjB®L¦ B®MfCkMf DKMfDKL¦ DKKjDFJ! DAH[DAGA'
                         ],
        xMin           : 84.5,
        xMax           : 196.5,
        yMin           : -21,
        yMax           : 785.5,
        wdth           : 273.5
      };
      font["m"]        = {
        sC             : [
                           'KÄ@q KQ@qKDAE K2B1JÄCu J¢F" JwFgJ_G& J=G¢I¹G¢ IsG¢H²GA H1F«G·Fg G¶E­G¼E/ H6C* HIA³HIA+ HI@£H.@e G¶@HGj@H G?@HG#@e F¬@£F¬A+ F¬AÄFrC« FZEpFZFf FZGMF<G© EyGhE2FÄ D>EÃ D/E¬C°Ec C°E(C¥D6 CxCCCxB° CxBpC£B; C­A©C­Ao C­AFCmA+ CN@³C%@³ B8@³B8B® B8CEBBD9 BME.BMEi BME¿BDF§ B;GlB;GÃ B;I~BÁI~ CDI~CeI] C§I;C§H· C§H¤C¢HZ C{H3C{GÂ C}G8 D/GÄD´Hv EuIJF9IJ GSIJG¯H1 HBHzH¯H¿ IVI@J6I@ KYI@K¸G³ KÃGnL=E¡ LXDVL¦AN L©A&Lj@¯ LK@qKÄ@q'
                         ],
        xMin           : 59,
        xMax           : 736.5,
        yMin           : -61,
        yMax           : 541.5,
        wdth           : 776.5
      };
      font["n"]        = {
        sC             : [
                           'H6@} Gc@}GXAX G<C. G/CÃG/D§ G/DÂG2Ea G5F!G5F= G5G³FhG³ E{G³D¹F± D<E»C­Dd C«D=C¤C§ C|CSC|C$ C|B«C¤BM CªA¶CªAv CªAICmA. CQ@¶C&@¶ B}@¶BcA. BGAIBGAv BGA¶BABM B;B«B;C$ B;C­BIE< BWFoBWGS BWGsBSH/ BPHnBPH¯ BPI6BmIQ B«ImC1Im C®ImC¶Hn C¹G| E:IUFhIU G¦IUHAHL HlGqHpF< HpEZ HoD¢ HoD.H¦C- H»B-H»A^ H»A2H}@º Ha@}H6@}'
                         ],
        xMin           : 60.5,
        xMax           : 491,
        yMin           : -35,
        yMax           : 533,
        wdth           : 523
      };
      font["ñ"]        = supplement(font.n,"tilde",-32,0);
      font["o"]        = {
        sC             : [
                           'E7@« C¶@«BÀA¤ A¼B«A¶Dl A°FHB¥Gq C®I6E¢I6 GBI6H&G¦ HxFtHuE( HrCOG¦B6 F©@«E7@«'
                         ],
        hC             : [
                           ['EsGq DcGrCµFh CSEzCSDl CSC_CÃB² DbBME7BM EÀBMFgBº G9CjG>Dv GLGpEsGq']
                         ],
        xMin           : 40.5,
        xMax           : 473,
        yMin           : -29,
        yMax           : 506,
        wdth           : 525.5
      };
      font["ô"]        = supplement(font.o,"circumflex",-32,0);
      font["ò"]        = supplement(font.o,"grave",120,0);
      font["ó"]        = supplement(font.o,"acute",90,0);
      font["ö"]        = supplement(font.o,"dieresis",-40,0);
      font["p"]        = {
        sC             : [
                           'Ei@Â Dª@ÂC´A? C²=m C²=ACv=$ CZ<­C0<­ B©<­Bl=$ BP=ABP=m BS@s BSCy BPENBDF¡ B6HD B6H¬BOI9 BmItC#It CJItCeIX C¡I=C¡H¹ C¡H°C|Hw CwHWCuH> DHHyD¹H¸ EeI1F,I1 GuI1HQG£ H½FtH½D¯ H½C9H)B0 G0@ÂEi@Â'
                         ],
        hC             : [
                           ['F,Go ERGoD­GF DVG*CªF_ C¶D¤C¶B° D¡BeEiBe FcBeG"C> GZC±GZD¯ GZF=G/F¹ F§GoF,Go']
                         ],
        xMin           : 58,
        xMax           : 492,
        yMin           : -284,
        yMax           : 536.5,
        wdth           : 534.5
      };
      font["q"]        = {
        sC             : [
                           'H9Cv G¯@¡ Gu?-Gu=§ Gu=YGY=> G?="F·=" F:="F4=¨ F2>0F9>s FF?_ FYA6 E¨@ÂEc@Â C±@ÂB­A± A}B§A}DU A}FtBÀGÃ DBIRF_IP F·IPG/I% GYIKG{IK GÄIKH>I+ HZH¯HZHe HZFDH9Cv'
                         ],
        hC             : [
                           ['E¼H& DfG©C­Fq C?EwC?DQ C?C_C©B¸ DSBEE]BI F8BLFdC. FµC¾F¸F! G"H& F²GÃF_H# F)H*E¼H&']
                         ],
        xMin           : 29,
        xMax           : 460,
        yMin           : -271.5,
        yMax           : 519,
        wdth           : 520
      };
      font["r"]        = {
        sC             : [
                           'HAF¶ H:E¼G`E¼ F®E¼F®F{ F®F¯F«G> F©G³ ElG¡D±G9 D8F{C¡E{ C£Ad C£@£BÂ@£ BI@£BIAd BIF³ BIG0BLGr BNH1BNHR BNI4C#I4 C§I4C¨Gµ E@IGG$IG GuIGG¾H® HBHPHBGX HBG$HAF¶'
                         ],
        xMin           : 67.5,
        xMax           : 448,
        yMin           : -33,
        yMax           : 514.5,
        wdth           : 480
      };
      font["s"]        = {
        sC             : [
                           'G]G1 G&G1F´GV F¦GpFyH? F/H,D¹G| CzG<CyFa C¸FVD2FQ EµF)F£Ec GÂD}GÂC: GÂA½F¸AI F"@ªDu@ª Cu@ªB£A2 AkAjAkBJ AkBrA«B² B&C,BNC, BmC,B¿B~ C4BhC©BX DGBLDuBL EFBLE¨Ba F`B}F`C: F`D>E%Dn D@D§ C>DÃB«EF B9E~B9Fl B9H7CzH± D4I)E5IM F5IsFnI® F¸IÀGDIÀ GoIÀG¬I¤ H#IgH#I: H#HÁH0Hh H<H0H<G· H<GiGÄGM G©G1G]G1'
                         ],
        xMin           : 20,
        xMax           : 445,
        yMin           : -29.5,
        yMax           : 557.5,
        wdth           : 486.5
      };
      font["t"]        = {
        sC             : [
                           'GWG¥ GBG¥G%G¦ F­G¨FwG¨ F`G¨ErGx E§C6 E¨B® E©BY E¬@¦DÂ@¦ Dy@¦D[@¿ D>A6D>A] D>A¤DABK DDB¸DDC; D1Gv CjGyBXG¨ A¤G´A¤Hg A¤H´A¾I- B6IJB`IJ D,I9 D,IlD&J> D"JµD"K7 D"KaD?K| D]K¹D¨K¹ E^K¹ElJ© EoJcEoJ/ EmIx ElI: FeIJFwIJ G[IJG|I@ H6I,H6He H6H9G¾GÀ G¤G¥GWG¥'
                         ],
        xMin           : 31.5,
        xMax           : 442,
        yMin           : -31.5,
        yMax           : 682,
        wdth           : 471
      };
      font["u"]        = {
        sC             : [
                           'HyHn HgE} HgE5HhD) HiB¿HiBV HiB@HlA¸ HpAjHpAS HpA)HS@± H6@tG°@t GB@tG.AP F3@´D·@´ C·@´C@AI BeA«BRB£ B,D¦B,FM B,GSBIH¡ BWISC%IS CPISCmI8 C¬HÀC¬Ht C¬HFC{Gd CmF¤CmFM CmE*CxD6 C¥CACºB| D8BjDWBa DwBWD·BW EºBWG)B¤ G(DG G%E¨ G%GXG8Ht GCIMGºIM HAIMH^I1 H{H¹HyHn'
                         ],
        xMin           : 53,
        xMax           : 475,
        yMin           : -39.5,
        yMax           : 520.5,
        wdth           : 520
      };
      font["ú"]        = supplement(font.u,"acute",90,0);
      font["ù"]        = supplement(font.u,"grave",120,0);
      font["ü"]        = supplement(font.u,"dieresis",-40,0);
      font["û"]        = supplement(font.u,"circumflex",0,0);
      font["v"]        = {
        sC             : [
                           'GTEA E®Au E¬@½E3@½ Dl@½DKAo C6D| A«H; A¡HUA¡Hi A¡H³A¿I, B;IIBdII BÀIIC7H° E/Cd EyD¢FhG( F¥GwG:H§ GYICG³IC H8ICHVI& HvH­HvHd HvH>GTEA'
                         ],
        xMin           : 30,
        xMax           : 473.5,
        yMin           : -20,
        yMax           : 515.5,
        wdth           : 486
      };
      font["w"]        = {
        sC             : [
                           'KZH, J±EnI¶B] IyA¦I8A$ H¹@rH[@s Gr@uG5B| G!COF°Da FnF9 EÀD¢ D¬Al D}AFDdA3 DF@{C©@y C;@vBwB¾ BSD3B0F5 A»GH A¯GÃA¯H[ A¯H§B)HÂ BEI:BoI: C9I:CJHj CWH/C`GZ CnFK D&B· D¶EAE«HJ F(I6FyI6 GEI6GaH= G{GKGÃE_ HGChHfB_ I,Dh J*H} J9I7J¡I7 K&I7KFH¾ KeH£KeHX KeHTKZH,'
                         ],
        xMin           : 37,
        xMax           : 657,
        yMin           : -40,
        yMax           : 508,
        wdth           : 684
      };
      font["x"]        = {
        sC             : [
                           'IKGª H<F¥ F±EU IMB5 IfA¸IfAx IfAQIHA4 I*@ºH¨@º Ha@ºHBA; GiB"E©DM DGB¬ C±BUBÂAi B£ADB]AD B7ADA½Ac A~A¢A~B$ A~BCA¸Bd B1BªBkC: C.CvCCC¯ D¶Ef C¶FÁ CFG¯B°H? BiHaBiHª BiI.B¦IM BÂIlCCIl C~IlDrHU E½Fl GYG¾ HQH®H|IK H½IzIEIz IlIzI«I] J%I@J%H¾ J%HfIKGª'
                         ],
        xMin           : 29.5,
        xMax           : 562,
        yMin           : -21.5,
        yMax           : 539.5,
        wdth           : 590
      };
      font["y"]        = {
        sC             : [
                           'HÀH) FKBN EN@DD¯>³ DK=R D2<¯Ct<¯ CJ<¯C,=& B²=BB²=k B²>KDcAÂ A§G@ AXGª A>H4A>HS A>H|A]H¼ A|I7AÄI7 BNI7BhH¸ C°G/EKC¨ F]FV G*G§GsH¥ G´I9HDI9 HmI9H®HÀ I)H£I)HY I)HDHÀH)'
                         ],
        xMin           : -2,
        xMax           : 499.5,
        yMin           : -283,
        yMax           : 507.5,
        wdth           : 520.5
      };
      font["z"]        = {
        sC             : [
                           'HpGX G»FpF³E) EtCBE*Bd E³BiF]Bi F¦BiGNBY G¼BJH?BJ HkBJH¨B. HÃA¶HÃAi HÃA<H¨@Ã Hk@¨H?@¨ G¼@¨GN@· F¦A!F]A! D¤A!C;@{ C&@wBº@w B9@wB9AI B9A{BjB& DiC±F·Gv EµGnEXGn DGGnC/G¦ BXG³BXHe BXH²BsI, B°IIC5II CfIIDEI> E%I2EXI2 E½I2FÂI< H#IEHgIE I9IEI9H£ I9H1HpGX'
                         ],
        xMin           : 59.5,
        xMax           : 507.5,
        yMin           : -38,
        yMax           : 515.5,
        wdth           : 538
      };
      font["A"]        = {
        sC             : [
                           'J©A# J,A#IkB® IQCdI*E> HGE1G%D° E!DX DrCXC|Ac C]A+C%A+ B¢A+BaAG BAAeBAA± BAB=CUDs CDD¯CDE- CDE}D#Eµ D¶GdF=It H$LfH^Lf I*LfIGKz I§I1 J¹C® KMBq KkAÄKkAª KkA^KLAA K-A#J©A#'
                         ],
        hC             : [
                           ['H~Fª H-I£ E¹F> F¯F]H~Fª']
                         ],
        xMin           : 63.5,
        xMax           : 660,
        yMin           : -15,
        yMax           : 721.5,
        wdth           : 731
      };
      font["Á"]        = supplement(font.A,"acute",200,200);
      font["À"]        = supplement(font.A,"grave",300,200);
      font["Ä"]        = supplement(font.A,"dieresis",160,200);
      font["Â"]        = supplement(font.A,"circumflex",100,200);
      font["Å"]        = supplement(font.A,"ring",180,180);
      font["Æ"]        = {
        sC             : [
                           'J%FR I?FOGÀF? E¶F& E>E3C»C/ C!A{ B¥AMBTAM B-AMA±Ak AoAªAoB. AoBHA¤Bg D1FVE²HY G¼K+ IIL¤JNM? JpMNJµMN K;MNKXM2 LMMQM5Mb MÀMrNzMr PzMrQuM8 R6L½R6LZ R6L1Q½Kµ Q¡KuQVKu QJKuQ8Ky O¤L&NzL& N)L&MJK¼ LmK­K¡Km KªK.KªJ© KªI~KxG´ O!H: PXHNP­HN Q6HNQRH1 QoG·QoGi QoF¹P¸F¨ O-Fr KkFG KbE<KbDQ KbBuK£BS K¾B8L½B8 MVB8NPB; OIB>OªB> O¼B>P?BD PgBJPzBJ QbBJQbAg Qb@»P±@¦ P;@oO;@n Mg@o KJ@oJsAM IÁB(IÁDQ IÁE@J%FR'
                         ],
        hC             : [
                           ['HwIi G<G{ I+G´J3G· JDI£JDJ© JDK"J?KI IfJxHwIi']
                         ],
        xMin           : 22,
        xMax           : 1082,
        yMin           : -42.5,
        yMax           : 791.5,
        wdth           : 1086.5
      };
      font["B"]        = {
        sC             : [
                           'H"Aj FG@¶Cr@¶ CG@¶C!A: B}AcB}A¯ B}D( B}E4B±G6 BÄINC"JK C!K#C.LV C5LªCNLº DSM@E}M@ G(M@HFLJ I~KDI~I~ I~G¦H9Fs ILF3I·Eh J^D¾J^DA J^CKI^B^ H§A²H"Aj'
                         ],
        hC             : [
                           ['FjEk E¥E| EvE|E[Ez EAEyE4Ey D¢EyDCE¤ D=D©D=D$ D=B[ F=BeG_C" H"C=HbCv HÀD(HÀDA HÀDpGÃE) GBEUFjEk','E}Ky D´KyDgKs DeJG DQGM E]GAEfGB FzGNGWGÁ H;HvH;I~ H;JZGUK) FoKyE}Ky']
                         ],
        xMin           : 93,
        xMax           : 589.5,
        yMin           : -23.5,
        yMax           : 767,
        wdth           : 630
      };
      font["C"]        = {
        sC             : [
                           'IyI¬ I9I¬H½JR H¢J´HhJÂ HSK)G¥K) FuK)EGIQ C^G.C^E) C^D+D.CP D¤BsEwBs F[BsG@C% GzCCHoC¼ I%DBIBDB ImDBI«D" J$C¦J$C] J$C0I¢B² G¡A*EwA* D,A*BÃBE A¼C]A¼E) A¼GuD/JP E¹LsG¥Ls H1LsHWLn H¡LjH¾L` I=L´IuL´ J7L´JIL8 JXKjJXJw JXJNJCJ/ J(I¬IyI¬'
                         ],
        xMin           : 43.5,
        xMax           : 587,
        yMin           : -12,
        yMax           : 743.5,
        wdth           : 602.5
      };
      font["Ç"]        = {
        sC             : [
                           'GG@7 GG>¹F>>[ Ed>4D*>4 C+>4C+>£ C+?ICs?I C§?ID)?H DN?FDb?F F4?FF4@7 F4@zEM@Ä D0AX C$B)B`BÀ A¼C´A¼E) A¼GsD/JP E¸LsG¥Ls H0LsHWLn H¡LjH¾L` I=L´IuL´ J9L´JOKÃ JXKoJXJw JXJIJ?J* J#I¬IyI¬ I:I¬H½JR H~J¶HdJÃ HQK)G¥K) FuK)EGIQ C^G-C^E) C^D/D,CS D¡BsEwBs FZBsGBC( GxCCH]C¯ I(DBIBDB IkDBIªD" J$C§J$C] J$B´H£B- GzA[FµA@ GG@¡GG@7'
                         ],
        xMin           : 43.5,
        xMax           : 587,
        yMin           : -199,
        yMax           : 743.5,
        wdth           : 602.5
      };
      font["D"]        = {
        sC             : [
                           'I]AH HE@bF*@b Ec@bDª@x C»@µCbA< CWA< C-A<B´AY BuAwBuAÃ BuBªB~DS BªEÃBªF© BªGzB¥I] B¡K?B¡L1 B¡LYC&L¨ CPM1CzM1 C³M1D¸Lq F,L%FCKÂ HXK@I¿I} K¤G·K¤E¢ K¤DXK3C> JeB$I]AH'
                         ],
        hC             : [
                           ['G²IR G,I¶DCK2 DHH¼ DKF¤ D;Bl DBBiDPB` E%B$F)B$ GªB$HnBj ILC*I§Cº J<D§J<E{ J<G°G²IR']
                         ],
        xMin           : 89,
        xMax           : 671.5,
        yMin           : -48.5,
        yMax           : 759.5,
        wdth           : 721.5
      };
      font["E"]        = {
        sC             : [
                           'I¥Ke IvKeIeKj H?K»G%K» FVK»ExK¬ D»K{D+K] D4JÀD4Jx D4IpD"G¥ GOH+ H®H>I6H> IbH>I¡H" I¿GªI¿GY I¿F¤IBFw GYFb C¹F8 CµEtC³E5 C±DxC±DA C±BjD-BC DDB(EFB( E¦B(F}B+ GwB/H3B/ HGB/HnB5 H¶B<I%B< I°B<I°AV I°@§I:@t H_@bF-@b C¡@bC(A1 BJA«BJDA BJD£BMEJ BPE·BUFk BJF¤BJF½ BJG;B^GV BqIqBqJx BqJ¾BhKb B^L%B^LJ B^M?C>M? ChM?C¨M! D{MBEcMQ FJMbG%Mb H¶MbIÄM( JcL±JcLJ JcL"JIK¨ J,KeI¥Ke'
                         ],
        xMin           : 68,
        xMax           : 592,
        yMin           : -48.5,
        yMax           : 783.5,
        wdth           : 624.5
      };
      font["É"]        = supplement(font.E,"acute",100,240);
      font["È"]        = supplement(font.E,"grave",200,240);
      font["Ê"]        = supplement(font.E,"circumflex",40,240);
      font["Ë"]        = supplement(font.E,"dieresis",80,240);
      font["F"]        = {
        sC             : [
                           'I{KE IiKEITKM H[KzF·Kz FTKzE~Kq E&KhD;KS D9H- EwH`FUH` GlH`H¯HN IiHDIiGk IiG>ILFÄ I/F¨H¨F¨ HSF¨GnF° FªF¹FUF¹ EµF¹D6F^ D-A> D-@·C´@x Cw@ZCL@Z C!@ZB©@x Bk@·BkA> BkB¡BsE¢ BzH£BzJA BzJmByKB BwK¼BwLD BwLpB´L¯ C,M)CWM) CxM)C³L» D­M-EkM7 FKMBF·MB G§MBH¸LÄ JYLuJYL, JYK¨J@Kh J#KEI{KE'
                         ],
        xMin           : 84,
        xMax           : 587.5,
        yMin           : -52,
        yMax           : 768,
        wdth           : 606.5
      };
      font["G"]        = {
        sC             : [
                           'K7E³ J{CfI9B1 Gx@¡Ep@¡ C¢@¡BªA§ A²B®A²Dº A²F·B©HÃ C¡K,E9LQ F6M@GBM@ G¾M@I,L¨ J_L?J_Kk J_KBJAK" J#J¦I|J¦ IfJ¦I>J¿ H)KxGBKx FzKxF)K* E¤J§E5IÃ CTGvCTDº CTCaC°B¹ DJBFEpBF FÁBFGÂC5 I&D*I]E§ GNEwE¯D¾ EwD³EaD³ E5D³D¼E2 D¢EPD¢Ey D¢F.E3FN F©GOJ­GO K4GOKPG2 KnF¹KnFl KnF,K7E³'
                         ],
        xMin           : 38.5,
        xMax           : 661.5,
        yMin           : -34,
        yMax           : 767,
        wdth           : 679.5
      };
      font["H"]        = {
        sC             : [
                           'LOKÄ LAKyLAK) LAJ¯LCJR LEI¼LEI} LEH½L4GY L!EºL!E5 L!DlL-CW L8BBL8Ax L8AOKÀA4 K¥@»KZ@» K3@»J»A4 J}AOJ}Ax J}BBJsCW JhDlJhE5 JhE~JmFF IEFCGOE· D5ED D5DmD"CK C´B)C´AP C´A(Cx@¯ C]@qC4@q B¯@qBr@¯ BVA(BVAP BVB8BhC¨ ByESByF: ByFqBuG] BqHIBqH£ BqIMB{Jh B§K¥B§LO B§LyBÂL· C:M/CcM/ C­M/D#L· D?LyD?LO D?K¤D5Jf D+IJD+H} D1F¨ GTGT IOG¦J{G§ J¨H³J¨K) J¨KuJÁL@ K>M(KyM( KÁM(L;L° LXLtLXLJ LXL;LOKÄ'
                         ],
        xMin           : 74,
        xMax           : 715,
        yMin           : -41,
        yMax           : 758.5,
        wdth           : 768
      };
      font["I"]        = {
        sC             : [
                           'HiJ¥ H*J¥GKJ² F.K" EºHªEºF¨ EºF@E¾E] EÂDxEÂD3 EÂCWE»B¯ HLB³ HvB³H´Bt I,BVI,B, I,A¤H´Ae HvAGHLAG G¸AGG(AE F:ABE§AB ECABDCA0 CB@ÁB¤@Á BX@ÁB<A; AÃAXAÃA¥ AÃB,B<BI BXBhB¤Bh C@BhDSB| D^CJD^D0 D^DtDVET DPF5DPFy DPHYDlK+ CmK& BnK# BCK#B&KA A®K^A®K¬ A®LeBhLn C6LuD±Lu FQLuHwLJ IML>IMKc IMK4I+J¼ H±J¥HiJ¥'
                         ],
        xMin           : 36.5,
        xMax           : 517.5,
        yMin           : -18,
        yMax           : 729,
        wdth           : 546
      };
      font["J"]        = {
        sC             : [
                           'JRK1 JAK1I¹K8 ImK@ITK@ I$K@HeK= HjJI HjDsG«B& GH@LF&@L D~@LCVAG AÀBPAÀC¤ AÀDzB£Dz CdDzCdC¦ CdC2DVBc EDA¸F&A¸ FxA¸F¹E¤ G$GjG$JI G$JeFÃK2 FeK1 F>K1EsK4 E$K6D¡K6 DSK6D6KQ C»KnC»K¿ C»L£DÃL£ EAL£E¦L~ FDL{FeL{ G!L{G¿L¥ HºL¬ITL¬ K3L¬K3K» K3KrJ¼KR J}K1JRK1'
                         ],
        xMin           : 45.5,
        xMax           : 632.5,
        yMin           : -59,
        yMax           : 739.5,
        wdth           : 665
      };
      font["K"]        = {
        sC             : [
                           'J&@¼ H¶@¼F¤BÁ D^ED D^E6 D]A7 D]@VCª@V CO@VC.@ª BµA/BµA_ BµCBBÃF¬ C.JPC.L4 C.L_CJL| CfL¼C²L¼ D8L¼DTL| DqL_DqL4 DqKUDeI° DYHLDZGf E^HbF¥IÀ H½Lc I;L«IeL« I®L«J)Ll JHLMJHL" JHKdHLIL FÁG°EeFW FZE]HTCv I:BÂ IsBuJ2B` J¢BEJ¢A¡ J¢A^JlA? JQ@¼J&@¼'
                         ],
        xMin           : 104,
        xMax           : 606.5,
        yMin           : -54,
        yMax           : 747.5,
        wdth           : 610.5
      };
      font["L"]        = {
        sC             : [
                           'I*Ak H<A6FP@° Dw@hCm@h B­@hB`@¨ B#A.B#A¾ B8D` BQGÁBQL? BQLjBnL© B¬M"C2M" C]M"CyL© C¶LjC¶L? C¶GºCzDS CmC> CfBnCgB/ EfB,HlC& H}C,H­C, I4C,IQB® IjBmIjBE IjAªI*Ak'
                         ],
        xMin           : 49,
        xMax           : 531.5,
        yMin           : -45.5,
        yMax           : 752.5,
        wdth           : 550.5
      };
      font["M"]        = {
        sC             : [
                           'Mu@q M@@qLÀA& L£AVLjBC LFCl KÁD«KGHÀ I¦DP IJB¹ I&B(H£Ac HW@»Gµ@» GY@»G7AV G!A¢F³B> FuC+ E´E§EFH° E"G_ D$C[ CÀB£CuAN CW@¥B¶@¥ Be@¥BGA# B/ABB/Am B/B³BsD~ C_G© C¹J: DAKµDrLT D»L°ERL° E´L°F1LE FWKoF¦Ic G6FÄH#D+ I4G"IÁJ: J;KI JMKÂJjLS J²L¿KQL¿ L$L¿LQKz LbKBLxI¶ M1FZMªCÄ N7Bz N]AsN]AS N]A)N<@° M¿@qMu@q'
                         ],
        xMin           : 54.5,
        xMax           : 845,
        yMin           : -41,
        yMax           : 749,
        wdth           : 882.5
      };
      font["N"]        = {
        sC             : [
                           'M!B½ M!BlL¶A¡ L¦@¾L*@¾ Kv@¾K*Ac GÀDZC½IÂ C¸HA CµFc CµE´C¹Dp C¼CMC¼B| C¼@uC4@u B¡@uB`@º BBA5BBA` BBA«BIB[ BOC.BOCW BOC¶BSD¯ BWE¨BWFA BWF¥BTG§ BQH©BQIG BQI§BEJ¡ B:KxB:L5 B:LcBaLª BªM,C8M, ClM,D8L; F+IOGnG^ ITE?KjC; KmCfKjD7 KgE2 KgH_KEJ] KAJwK*KC JºK¨JºL* JºL¿K¡L¿ M(L¿M(H! M(G5M$E_ M!CªM!B½'
                         ],
        xMin           : 60,
        xMax           : 755,
        yMin           : -39,
        yMax           : 757,
        wdth           : 796.5
      };
      font["Ñ"]        = supplement(font.N,"tilde",160,160);
      font["O"]        = {
        sC             : [
                           'GQ@© E=@©C¡B+ B3C[B3Eq B3HBC|JV E[L¬H)L¬ JkL¬K©Ky M)JcM)GÁ M)ELKsC< IÂ@©GQ@©'
                         ],
        hC             : [
                           ['H)KA F9KAD¶IS C{GyC{Eq C{D4D©C= E®BNGQBN I>BNJXD= KcE¶KcGÁ KcIªJ{Jg I¹KAH)KA']
                         ],
        xMin           : 56.5,
        xMax           : 755.5,
        yMin           : -30,
        yMax           : 739.5,
        wdth           : 798
      };
      font["P"]        = {
        sC             : [
                           'DUE¢ D9E¢C_E® CVDyCVAª CVAaC<AE C"A*B~A* BVA*B=AE B"AaB"Aª B"D% B"E5B5G: BHITBJJO BJKU BJL6BVLc BmM8C6M, CUM6C²M; DHM@D¿M@ FOM@GlLF HºK?HºI¤ HºG²G`F£ F;E¢DUE¢'
                         ],
        hC             : [
                           ['D©K© D[K©D9K§ CºK¥C£K¡ C¡JK CjGF DUG9 EzG9FjG¯ GeHhGeI¤ GeJpFpK> E¦K©D©K©']
                         ],
        xMin           : 48.5,
        xMax           : 490.5,
        yMin           : -12,
        yMax           : 767,
        wdth           : 520.5
      };
      font["Q"]        = {
        sC             : [
                           'M¬=¹ M_=¹KÄ?= J8@¶ H¶@PGr@P EK@PCmB; A°D$A°FM A°I)C³JÀ E±L¬HjL¬ KVL¬L¶Jy N3H°N3E¼ N3CVKxAz MK@5 NI?I No?%No>~ No>UNQ>6 N3=¹M¬=¹'
                         ],
        hC             : [
                           ['HjK? F^K?D¿I¯ CUHUCUFM CUDxD{CJ EÃA½GrA½ H4A½H}B+ G?COG?D. G?DYG`Dv G¢D´H%D´ HUD´HzDc IYCfJSB¤ LkD"LkE¼ LkH;KuIq JnK?HjK?']
                         ],
        xMin           : 37.5,
        xMax           : 854,
        yMin           : -214,
        yMax           : 739.5,
        wdth           : 876
      };
      font["R"]        = {
        sC             : [
                           'I°A7 IiA7IHAV F¨C¸CzD§ C¤CD C©A§ C©AYCkA< CN@ÂC#@Â B{@ÂB_A< BBAYBBA§ BBBQB;Ck B4D¦B4EP B4F*BGG[ B[H°B[Ig B[I»BRJ{ BHK[BHK° BHLEBiLp B°M!CNLÀ E9L® F?L{F¾LJ J%JyJ%HI J%G4HÃFB H3EgF´E6 IAC¶JWB` JrB?JrA¿ JrAtJSAU J5A7I°A7'
                         ],
        hC             : [
                           ['DÂKB C²KM C»JW CÂI²CÂIb CÂH¶CµGÂ C¡F] C¯F]D(F] DEF[DTF[ FMF[GIFÀ G£G;H.Gm HcH"HcHI HcIQGHJF F:K1DÂKB']
                         ],
        xMin           : 57,
        xMax           : 599.5,
        yMin           : -17.5,
        yMax           : 749.5,
        wdth           : 628
      };
      font["S"]        = {
        sC             : [
                           'BDC5 BCC_BaCy B~C´C&C´ CWC´C|C[ D-B´DTBw E&B?FEB? G]B?H_B¤ I§CUI§Dk I§EfHzF- G¦FkFUFp E:FvDNG2 CCG¥CCH¸ CCJCD¬KR FELZG±LZ HnLZIeL: J¥K³J¥KN J¥JzJ*Jz I¦JzI!J± H@K"G­K! FsJÃE«JV D½I®D½HÃ D½HOF+H- FaGÄG|G¹ IZG¨JXF¬ KLE»KLDv KLB°IvA¥ H:@­FD@­ D´@­C~AN BGB!BDC5'
                         ],
        xMin           : 65,
        xMax           : 645,
        yMin           : -28,
        yMax           : 716,
        wdth           : 693
      };
      font["T"]        = {
        sC             : [
                           'KuJ¶ K+J¶I¸JÂ H¥K)H6K( GrK( GuJ!G®Gt GÄEYGÄD< GÄC½H(CU H.B³H.Bm H.B*G¼A{ G¡A:GDA: FÀA:F¡AU F_AqF_A¾ F_B*FdBG FiBfFiBt FiC"FcC¦ F]DcF]D¶ F]EÂFEG¿ F.J-F+K# ERK" C}K"B¥KC B3KWB3L" B3LKBLLk BjL¯BºL¬ C:LªD4Lx D¸LmERLm E¯LmF§Lo G|LrH5Lr H£LrI·Lg K(L[KuL[ KÁL[L:L> LVKÄLVKx LVKML:K0 KÁJ¶KuJ¶'
                         ],
        xMin           : 56.5,
        xMax           : 714,
        yMin           : -4,
        yMax           : 739.5,
        wdth           : 679.5
      };
      font["U"]        = {
        sC             : [
                           'GE@½ D¸@½C£BI BªCVBiEj BYFfBYIX BYJbB`K5 BfK±BqL1 B¬LyCHLy D!LyD!KS D!F¹ D!BFG@BF JFBFJFJ* JFJPJFJ­ JEKEJEKX JEK¸JZLC JwL~K+L~ K°L~K°Kx K°KOK±J¡ K±J-K±I¨ K±@½GE@½'
                         ],
        xMin           : 75.5,
        xMax           : 678,
        yMin           : -20,
        yMax           : 733.5,
        wdth           : 736.5
      };
      font["V"]        = {
        sC             : [
                           'K=K} J£K!JZJ> I³Hi G¬C! G[B$FÁA. F¢@tFF@t E|@tE^A@ DgCiCVG¹ B¬J" BOKoBOL, BOLXBoLu B®L²C3L² C~L²CµL? D7J¸ D·HI EsE_FKCW FQCg HVI+ I)J¾ IbL+IÃLv J@LÀJmLÀ J¶LÀK2L¢ KPLbKPL7 KPK½K=K}'
                         ],
        xMin           : 70.5,
        xMax           : 647,
        yMin           : -39.5,
        yMax           : 749.5,
        wdth           : 649.5
      };
      font["W"]        = {
        sC             : [
                           'L/@e K¥@eKa@~ K9@½K9AE J¯B<J£B© JvCPJ3F+ I¤H1IrIQ H½F±H6E/ GCC,FÄA¼ G-A¦G-An G-ABF©A$ Fc@®F5@® E2@®E2A¤ D¶B~ D)F] CjHNBPKµ BIL&BIL9 BIL·C0L· CpL·C´LN D"L+DYJ§ DµISELGZ F+D+ F¶EÀG|Hz H:JMH[JÂ I3LwI©Lw JKLwJhL1 J­K^K.HÄ KBG¤KrEÃ LEBÃ MGE[N¯It NºI³O=K+ OYKÁO¥L^ P$L¶P_L¶ Q@L¶Q@L1 Q@KÃPÄKO P{Jg PDI8 N!Cx M{B¦L¼A$ Lv@eL/@e'
                         ],
        xMin           : 67.5,
        xMax           : 1023,
        yMin           : -47,
        yMax           : 745,
        wdth           : 1039.5
      };
      font["X"]        = {
        sC             : [
                           'K§Kh J¤JIJ;Ic IAH. H{GIH;F§ IµDI JµB²KwA» K³AyK³AU K³A,Ks@± KT@pK+@p J©@pJg@± IÁARIPBG HMC³ G3Em DdBi C0@Á B³@¡Bi@¡ B@@¡B!@¿ A§A;A§Ae A§AªAÀB% CMCk F;F¶ EPH"DWI3 CfJM BÄK(BhKY B>K|B>L( B>LPBZLq BwL²BÃL² CtL²DuK_ D¿K"EoJ5 F^I0GBH+ HÄJb J{L²K:L² KcL²K£Lr KÂLRKÂL) KÂKªK§Kh'
                         ],
        xMin           : 33,
        xMax           : 686.5,
        yMin           : -41.5,
        yMax           : 742.5,
        wdth           : 723.5
      };
      font["Y"]        = {
        sC             : [
                           'J:K" J"J~I}J0 HTF´ GsE(F¿Cz F!AÂ EoA6 EN@~Dº@~ Dr@~DR@¼ D3A6D3Aa D3A¤D±C0 EªD¯ DXFnD#Gp CyH^BµIy A¨KKAmKx A_K´A_L+ A_LUA~Ls A¾L²BBL² BsL²BµLb CbKi DHJODjIº E3HÂE]H8 E}GhFfF[ HEJ| HlK?I.LK IJL±I¬L± J0L±JOLt JoLWJoL, JoK¢J:K"'
                         ],
        xMin           : 14,
        xMax           : 598,
        yMin           : -34.5,
        yMax           : 742.5,
        wdth           : 635
      };
      font["Z"]        = {
        sC             : [
                           'J¹Jª IµJ- HaI#F£Fv D)B¥ C³B^CzB> FvBL HoBXIsBX JtBXK0BL K¢B=K¥A} K§ALKdA0 KF@»J½@» J~@»JE@¾ I¯@ÁIq@Á H[@ÁF2@º C¬@³Bu@³ A§@³A§As A§B3B@B· C)D% E¬G³ GdJ0HÂKO FIK< C>K< C4K<BÂK: B­K9B£K9 A»K9A»KÁ A»LaBMLv BnL¦C8L¦ C|L¦D£Lv E©LhFILh F·LhH*Lr I@L{I¯L{ KªL{KªK¿ KªK[J¹Jª'
                         ],
        xMin           : 33,
        xMax           : 674.5,
        yMin           : -25,
        yMax           : 736.5,
        wdth           : 693
      };
      font["0"]        = {
        sC             : [
                           'E¹@¾ Cn@¾BfC+ A~D}A~GK A~IgB§K9 D"M0F4M0 H5M0IEKU JAI»JAGª JADRI6Bx H,@¾E¹@¾'
                         ],
        hC             : [
                           ['F3Ku D¡KuC¶J; C;HÄC;GZ C;D¼C´Cy DiBWE¹BW GfBWH?DC H¡EhH¡Gd H¡ImH+Jq GYKuF3Ku']
                         ],
        xMin           : 29.5,
        xMax           : 575.5,
        yMin           : -19.5,
        yMax           : 759,
        wdth           : 610
      };
      font["1"]        = {
        sC             : [
                           'FrAA E/AA CnAB C)ABB±AJ B]A]B]A¸ B]BxCvBx D#Bw DLBu DLC"DDC¢ D;D[D;D¬ D;E¨DRG¥ DhI|DgJ| CeI¹C?I¹ B»I¹B}J3 B`JPB`Jx B`K#C3Kg ChK®DHL^ DÁM4EmM4 F.M4F.Lj F.LRF(L% F!KzF!Kd F!KCF$J¤ F)J@F)IÃ F)I0E´GT E{ExE{D¬ E{DPE¥C¢ E¬C.E­B{ FrB} F½B}G5Bb GPBFGPAÁ GPAvG5A[ F½AAFrAA'
                         ],
        xMin           : 77,
        xMax           : 391,
        yMin           : -0.5,
        yMax           : 761,
        wdth           : 450
      };
      font["2"]        = {
        sC             : [
                           'H½A@ H¤A@HUAO H)A_G´A_ G`A_F}AX E»AREfAR E?ARDvAH D*A?C§A? CzA?CfAB CPAFCEAF B¥AFBnA« BcB*BcB~ BcDbC_El C¹F+E²GV F¾H5GJHl GÁIIGÁJG GÁJ¨GMK6 F©KcFAKc EhKcD¹K. C®JA CbIÃCGIÃ BdIÃBdJq BdJÁB«K? C{L*DNLZ EDLÀFALÀ G`LÀH[LH IgKhIgJP IgImIJH» I-HDHuG¢ H+G&F}F: EDEGD®D¯ CÁC¾CÃB| EjB± G8B¼G´B¼ H[B¼HÁB£ IwB_IwAÄ IwA|I[A^ IAA@H½A@'
                         ],
        xMin           : 80,
        xMax           : 538,
        yMin           : -1.5,
        yMax           : 749.5,
        wdth           : 610
      };
      font["3"]        = {
        sC             : [
                           'E³@¸ D~@¸C«AR B§A¼BVB½ BPC,BPC< BPCeBoC~ B¯CºC3Cº CZCºCwCt D"C0 DFB£D¥Bi E=BPE³BP F|BPGKBµ GÃCYGÃD> GÃERG3F* FTFwE5F© DIF´DIG_ DIG»DÁH6 FªHq GKH«GnI2 G²I[G³Iº GµJnGNK! F©KXE©KX ECKXD¨K8 C¹Jt CwJ_CdJ_ C;J_BÃJ} B§J½B§K@ B§K°C¼LT D¾L·EpL· GAL·H<L7 I@KSI@I¾ I@H5G©Gm GwGfGaG_ HcG/I"FO IdEqIdDc IdBÄH[A¾ GT@¸E³@¸'
                         ],
        xMin           : 71,
        xMax           : 528.5,
        yMin           : -22.5,
        yMax           : 745,
        wdth           : 610
      };
      font["4"]        = {
        sC             : [
                           'HpDm HpA¦ HpA(G¹A( G/A(G/B6 G/BGG0Bi G2B«G2B¶ G1Dr C¦D} B~D}BID¨ AqD¶AqEJ AqEwB%F9 B{FÀ F[LZ F¿M5G¤M5 HpM5HpLU HpF* H£F+HºF+ JKF+JKEJ JKD§I£Dr I`DiHpDm'
                         ],
        hC             : [
                           ['G1F. G1K% E-G©C½F7 G1F.']
                         ],
        xMin           : 23,
        xMax           : 580.5,
        yMin           : -13,
        yMax           : 761.5,
        wdth           : 610
      };
      font["5"]        = {
        sC             : [
                           'Eg@§ CQ@§BNBQ B=BnB=B« B=C.B[CJ BzCfBÂCf CGCfClC; CÂB}D9Bk DzB?EgB? F²B?G¢C@ HjD;HjEi HjFxH:GP G¡H@F£H@ EºH@EUH# DÃG°DkGW C£Fc CUF6C(F6 B¤F6BgFR BJFoBJF¸ BJG)BZHC B|JxB|KW B|KzBkL! BYLJBYL_ BYL½C?L½ CSL½C{L¹ D!L¶D6L¶ DoL¶E`Lº FQL¾F¬L¾ G#L¾GYL¼ G²LºH*Lº H<LºH`LÁ H¥M$H·M$ I:M$IWL¬ IvLnIvLH IvKZG°KZ GpKZGAK] F¶K_F¬K_ EeK[ D?KV D?K*C¾H´ DÄI}F£I} HVI}IHHT J&GEJ&Ei J&CbH°B6 Gn@§Eg@§'
                         ],
        xMin           : 61.5,
        xMax           : 562.5,
        yMin           : -31,
        yMax           : 753.5,
        wdth           : 610
      };
      font["6"]        = {
        sC             : [
                           'E¬@| C­@|BµB6 B.COB.EO B.I1E5K· E´Lr FUM1FxM1 FÁM1G;L¸ GYLzGYLS G[L0FwKL E/I¬ DaI9D&Gº D}H>E;HQ E|HeF#He G«HeH¥Gk I~FqI~D´ I~C(HzA¸ Gp@|E¬@|'
                         ],
        hC             : [
                           ['E¬FÀ E5FÀDsF£ DYFuCsF4 CmE¤CmEO CmCÃD&C2 DrB$E±B$ G!B$GtB² H>CqH>D´ H>EºGrFZ G#FÀE¬FÀ']
                         ],
        xMin           : 54,
        xMax           : 541.5,
        yMin           : -35.5,
        yMax           : 759.5,
        wdth           : 610
      };
      font["7"]        = {
        sC             : [
                           'J(K= IPJU HQIAGgGo F4Di F!D=EcBª E0AwD§A/ Di@¤D6@¤ C²@¤Cr@¿ CSA8CSA_ CSA¦C´B¿ EnG6 F¢IwG»K" H+K7 D@KA BfKG A©KOA©L# A©LMAÄLi B=L¥BgL¥ CbL¥EWL{ GNLtHILt I}Lt JdLtJdL5 JdKªJ(K='
                         ],
        xMin           : 34,
        xMax           : 592.5,
        yMin           : -32.5,
        yMax           : 736,
        wdth           : 610
      };
      font["8"]        = {
        sC             : [
                           'E¼@° DK@°CLAh B<BLB9C³ B5FLC¹G> BiH(BiIk BiK"CoKÀ DoLµF$L· I?L»I?I¡ I?H¬H³HJ HkG¸G~G^ H±F·IIF? I°E]I°D- I°BgH{Au Gr@°E¼@°'
                         ],
        hC             : [
                           ['E³F| DvF2DAE¡ CqE-CvC¼ CzBÂDfBd E5B8E¼B8 GEB8G¬B¬ H@CIH@DL H@ELG]E½ F½FPE³F|','F!Kf E#KfDcJÁ D%J[D&Ik D(HbE«H( F~HJG/Hm G¤I"G¤I¡ G¤J¦GEK9 FµKfF!Kf']
                         ],
        xMin           : 59.5,
        xMax           : 549.5,
        yMin           : -26.5,
        yMax           : 745,
        wdth           : 610
      };
      font["9"]        = {
        sC             : [
                           'G?B8 FyA¦E[A9 D,@fCh@f C?@fC%@¥ B¯@ÂB¯AF B¯A£CNAÀ DrBU E¬BµFaCd G8D3G¤EF H+E½ GuE|FÁEa FHEFEµEF DZEFCSF- B/G*B/H³ B/JÄCWL) DgLÀFPLÀ G¦LÀHµK® J(JqJ)H· J*F¿INE3 HkC7G?B8'
                         ],
        hC             : [
                           ['F4Kx D³KxD>K! ClJMCkI! CkGµDOGC E(F¡F/F¡ F~F¡GRG- GzGBH_G° HlHcHlH· HkI±G§J¥ FÁKxF4Kx']
                         ],
        xMin           : 54.5,
        xMax           : 563.5,
        yMin           : -46.5,
        yMax           : 749.5,
        wdth           : 610
      };
      font["¡"]        = {
        sC             : [
                           'B7L­ B7M-BSMG BoMbBµMb C9MbCbM. C©L¡C©LV C©L3CkK½ CNK£C+K£ B¨K£B^L3 B7LdB7L­',
                           'B9AX B9I¹ B9JoB³Jo CgJoCgI¹ CgIpCiHÂ CkHPCkH) CkF¾CiD£ CgBgCgAX Cg@¤B³@¤ B9@¤B9AX'
                         ],
        xMin           : 58.5,
        xMax           : 162,
        yMin           : -32.5,
        yMax           : 783.5,
        wdth           : 237.5
      };
      font["!"]        = {
        sC             : [
                           'C©AX C©A5Ck@¾ CN@¤C+@¤ B§@¤B^A4 B7AeB7A¯ B7B/BSBH BoBcBµBc C9BcCbB/ C©A¢C©AX',
                           'C¨L­ C¨DK C¨CuC.Cu BWCuBWDK BWDtBTEC BREµBRF9 BRGGBTIc BWK}BWL­ BWMbC.Mb C¨MbC¨L­'
                         ],
        xMin           : 58.5,
        xMax           : 162,
        yMin           : -32.5,
        yMax           : 783.5,
        wdth           : 237.5
      };
      font["|"]        = {
        sC             : [
                           'DuNL EHNLEHMv EH?R EF>aDt>a D9>aD$?* C½?QC½AZ C½Mv C½M¾D4N4 DMNLDuNL'
                         ],
        xMin           : 172,
        xMax           : 259,
        yMin           : -177,
        yMax           : 837,
        wdth           : 421
      };
      font['"']        = {
        sC             : [
                           'FaLv FaLgF^LJ F[L-F[KÃ FRI# FPHLE|HL EVHLE<He E"H~E#I! E-L$ E/LtE9Lµ ENMLE¬ML F0MLFHM3 FaL¾FaLv',
                           'CbI¦ CbItCfIS CkI3CkI# CkH£CPHi C6HPB´HP B3HPB3Ix B3J7B6K8 B9L9B9Lz B9LÂBQM8 BjMPB³MP C6MPCNM8 CgLÂCgLz CgL;CeK> CbJBCbI¦'
                         ],
        xMin           : 56.5,
        xMax           : 335,
        yMin           : 453,
        yMax           : 775,
        wdth           : 424
      };
      font["'"]        = {
        sC             : [
                           'D¨LF D¨L(D­Kp D±K5D±J» D±I¾D7I¾ C{I¾CjJF CcJ]CcK" CcK>C]Ku CWL*CWLF CWM&C`MI CsMºD5Mº DZMºDtM¢ D¯MhD¯MB D¯M-D¬L§ D¨LZD¨LF'
                         ],
        xMin           : 138.5,
        xMax           : 230,
        yMin           : 556.5,
        yMax           : 810.5,
        wdth           : 388
      };
      font["#"]        = {
        sC             : [
                           'BFEv D%Ev DÀH­ B»H­ B<H­B<Im B<J6CLJ6 ENJ6 EhK&E¾Ll F7MEF°ME G.MEGCM+ GXL´GXLs GXLJG>Kr F¶JUF¯J6 JgJ6 JªK,KALs KZMEKÃME LtMELtLy LtL6KÄJ6 MaJ6 NDJ6NDIn NDH©MUH© MGH©M(H« L¬H­L{H­ KmH­ J§Ev LKEv L¶EvM0Ek MdEWMdD¿ MdDBL±DB JSDB I}A¨ IbA%H±A% H>A%H>At H>B-H_B¾ H®D5H±DB E%DB D¬CPD?As D"A-CaA- BµA-BµA{ BµAÃC(Bi CJCVCmDB B2DB AbDBAbE" AbEIA¥Ea AÁEvBFEv'
                         ],
        hC             : [
                           ['FWH­ E^Ev IEEv J3H­ FWH­']
                         ],
        xMin           : 15.5,
        xMax           : 833,
        yMin           : -14,
        yMax           : 769.5,
        wdth           : 842.5
      };
      font["$"]        = {
        sC             : [
                           'G.M¢ G.LZ G1LZ G²LZHªL: J$K³J$KN J$JzINJz I&JzHDJ± GcK"G.K! G.G· H¨G¤I¢F© JpE¸JpDv JpC1IhB0 HpA?G.@½ G.>º G.>rF¸>X F}>?FV>? E£>?E£>¸ E£@± B"@¸B"B¨ B"C^BuC^ C!C^CLC9 C®B¦D+Bs DzBKE£BE E£Fp EyFp DbFvCsG9 BjG°BjI" BjJ(CgJÂ DZK¯E£L> E£Mz E£MÂE½N9 F3NRFZNR G.NRG.M¢'
                         ],
        hC             : [
                           ['G.FV G.BZ G¸B~HZCA I(C²I(Dk I(E·G.FV','E£H# E£J¥ D=J9D=HÃ D=HAE£H#']
                         ],
        xMin           : 48.5,
        xMax           : 598.5,
        yMin           : -193.5,
        yMax           : 840,
        wdth           : 693
      };
      font["%"]        = {
        sC             : [
                           'J³A/ I®A/I3A¡ HWBQHWCV HWDgI)EE I¢F+J±F+ K¶F+LwEa MfD°MfC¯ MfBwL¨A¶ L$A/J³A/',
                           'JxL[ JRKÃJ)K@ IeJ! H"F¦ FHC6 F*BkEfAX EJA#D¿A# D}A#DcA; DHARDHAu DHA¦DNA¸ D¡B»EiDn FgFiF¯GB H·K¯ IIL±IvM> I¶M`J3M` JTM`JoMF J«M-J«L¯ J«LwJxL[',
                           'DsI: CjI:B½I¼ BQJsBQK| BQL[C5M2 C·M¨DvM¨ E¦M¨FWM& G&LLG&K> G&JGFCI~ EkI:DsI:'
                         ],
        hC             : [
                           ['J±Dª JHDªIÃDR I}CÄI}CV I}B·J%Bt JPBRK$BR KuBRK½B£ LAC/LAC¯ LADDK§Di KODªJ±Dª'],
                           [],
                           ['DsLb DELbCÁLD CuL"CuK| CuK-C·J© D4J_DsJ_ E&J_ERJw E¦J´E¦K> E¦K³E`L8 E:LbDsLb']
                         ],
        xMin           : 71.5,
        xMax           : 785.5,
        yMin           : -15,
        yMax           : 801.5,
        wdth           : 820
      };
      font["&"]        = {
        sC             : [
                           'DºJ{ DºK[EiLG F?M9FÁM9 G°M9HMLl H«L"H«K1 H«IlFÀH: GiF¸H§D¾ H»EQI!E­ I1FoI8F© IRGWI©GW J/GWJGG+ JZF©JZFZ JZD¶IvCk J»AlJ»A; J»@»J}@¢ Ja@gJ=@g I´@gIs@» H¤BZ G=@½EJ@½ C¶@½BµA® A®B£A®D4 A®ErB½F¯ CnGgEIHz DºI~DºJ{'
                         ],
        hC             : [
                           ['E¶GY DlFjD/F- C9E6C9D4 C9CIC±B© D^BHEJBH F²BHGÂCp GUD_E¶GY','F^Ie GZJLGZK1 GZK_GKKu G<K­FÁK­ F¯K­FjKL FEJ±FEJ{ FEJ8F^Ie']
                         ],
        xMin           : 36.5,
        xMax           : 619,
        yMin           : -46,
        yMax           : 763.5,
        wdth           : 654
      };
      font["("]        = {
        sC             : [
                           'FjLª FjLfF-L" E£KxETKJ DhJOD*Hk CuG"CuEc CuAsEU?® E¥?iF0?E Fi>»Fi>m Fi>KFO>4 F5=¿E·=¿ Ex=¿EN>2 B1?½B1Ez B1G¥B¾I´ CµL?ETMG E|McE´Mc F4McFOMF FjM*FjLª'
                         ],
        xMin           : 55.5,
        xMax           : 339.5,
        yMin           : -211,
        yMax           : 784,
        wdth           : 366
      };
      font[")"]        = {
        sC             : [
                           'FjEz Fj?½CK>2 C"=¿B©=¿ Bf=¿BK>4 B2>KB2>m B2>»Bk?E Bº?iCE?® E%AsE%Ec E%G"DqHk D2JOCFKJ B¼KxBnL" B1LfB1Lª B1M*BKMF BfMcB«Mc BÁMcCFMG D«L?E¢I´ FjG¥FjEz'
                         ],
        xMin           : 55.5,
        xMax           : 339.5,
        yMin           : -211,
        yMax           : 784,
        wdth           : 366
      };
      font["*"]        = {
        sC             : [
                           'ApKF ApKkA¬K© B!L!BEL! B^L!DNKD DFLKDFL¢ DFM$D`M> DyMVDÀMV ECMVE]M> EvM$EvL¢ EvLJE|KZ GfK~G½K~ H>K~HVKd HoKJHoK# HoJaH$JP GaJBF3J- FmI{G/I) G¨H=G¨G¶ G¨GqGkGV GOG<G,G< F©G<FiG` F-H/E%IE C^GbB¸Gb BsGbBWG~ B=G»B=H; B=H]B]H} B½I0C´J$ CAJ>B&J{ ApJµApKF'
                         ],
        xMin           : 22.5,
        xMax           : 470,
        yMin           : 381,
        yMax           : 778,
        wdth           : 529.5
      };
      font["+"]        = {
        sC             : [
                           'H=F5 H=E´H$Ew G°E]GjE] G^E]GFE` G/EdG!Ed F@Eb E¨E`E`Eb E`C} E`C#D«C# D^C#DGC: D1CPD1C} D0Dm D/E_ C9EWB«EW AqEWAqF1 AqFqB%F£ B9F¨B«F¨ C9F¨D/F® D.G¡ D.HVD7Hz D@H¿DUI- DjI?D­I? E/I?EII& EcH²EcHk EcHYE`H5 E]G´E]G¢ E^F² F%F¯ F9F¯FbF² F¬F´FÀF´ H=F´H=F5'
                         ],
        xMin           : 23,
        xMax           : 445.5,
        yMin           : 113,
        yMax           : 510.5,
        wdth           : 480
      };
      font[","]        = {
        sC             : [
                           'CX>s C6>sB¿>¯ B¦?%B¦?H B¦?fC?@q CuAkC³AÀ D*BLDTBL DxBLD³B1 E)A¹E)Au E)A^CÁ?% C«>sCX>s'
                         ],
        xMin           : 96.5,
        xMax           : 243.5,
        yMin           : -168,
        yMax           : 69,
        wdth           : 276.5
      };
      font["-"]        = {
        sC             : [
                           'FYD´ ETD§B£D§ B.D§B.EP B.E¿B£E¿ CME¿DhF" E¥F*FOF* G%F*G%E_ G%D½FYD´'
                         ],
        xMin           : 54,
        xMax           : 370,
        yMin           : 225,
        yMax           : 308,
        wdth           : 416.5
      };
      font["."]        = {
        sC             : [
                           'CF@h B¶@hBq@­ BMA-BMAa BMAµBqB5 B¶BYCFBY CyBYC¿B5 D?AµD?Aa D?A-C¿@­ Cy@hCF@h'
                         ],
        xMin           : 69.5,
        xMax           : 190.5,
        yMin           : -45.5,
        yMax           : 75.5,
        wdth           : 249
      };
      font["/"]        = {
        sC             : [
                           'Bo@k BJ@kB/@¥ A·@½A·A? A·ANA½Aa BhC2D9F= E¯IHFZJ¾ GYMyG¾Mv H?MuHZM] HwMCHwLÂ HwL¬HlLk G¡Ja G<I+FCG? DoD+ C=A" C"@kBo@k'
                         ],
        xMin           : 41,
        xMax           : 474,
        yMin           : -44,
        yMax           : 793.5,
        wdth           : 511.5
      };
      font[":"]        = {
        sC             : [
                           'DEHh DEH;D)GÂ C±G¦CcG¦ C6G¦B¼GÂ B~H;B~Hh B~HtBzH® BuI"BuI/ BuIYBµIv C/I³CZI³ DEI³DEHh',
                           'DVBÁ DVBsD9BV CÀB:CrB: CEB:C*BV B±BsB±BÁ B±C1BªCT B¤CyB¤C­ B¤D3BÃDN C>DjCiDj DVDjDVBÁ'
                         ],
        xMin           : 89,
        xMax           : 202,
        yMin           : 60,
        yMax           : 551,
        wdth           : 298.5
      };
      font[";"]        = {
        sC             : [
                           'Bi?§ A´?§A´@a A´@ÂBfA¾ C;B¿CuB¿ CºB¿D3B¥ DNBiDNBD DNAÄC­AQ CC@~C>@W C5?§Bi?§',
                           'DSHb DSH6D7G½ C½G¡CpG¡ CDG¡C(G½ B¯H6B¯Hb B¯HoBªH© B¥HÁB¥I) B¥ISBÃIp C=I®ChI® DSI®DSHb'
                         ],
        xMin           : 39.5,
        xMax           : 200.5,
        yMin           : -95,
        yMax           : 548.5,
        wdth           : 298.5
      };
      font["<"]        = {
        sC             : [
                           'CfE¼ C¾ErDlDÀ EJD:EnC¿ E³C¡E³CZ E³C6EwB½ E]B¢E8B¢ DÀB¢D¥B¶ D[C0C[D6 BzD¿AÁE? ATE[ATE³ ATFAAºFb BsF°C`G£ DwHÁD¶I6 E0INEMIN EqINE®I3 F%H»F%Hu F%HSE¬H5 E+GRCfE¼'
                         ],
        xMin           : 9,
        xMax           : 306,
        yMin           : 94.5,
        yMax           : 518,
        wdth           : 381
      };
      font["="]        = {
        sC             : [
                           'D6D¨ DwD¨ExD¥ FyD¢G8D¢ G²D¢G²D( G²CQG8CQ FyCQExCT DwCWD6CW C»CWC_CS C"COBªCO B-COB-D% B-DwB¤D~ CnD¨D6D¨',
                           'C¡H´ GFH³ GÀH³GÀH9 GÀGcGFGc C~Gd CgGdC:Gb B±G_ByG_ BRG_B:Gy B!G´B!H6 B!H~BuH¯ B­H´C¡H´'
                         ],
        xMin           : 48,
        xMax           : 429.5,
        yMin           : 134.5,
        yMax           : 487.5,
        wdth           : 510
      };
      font[">"]        = {
        sC             : [
                           'F³FI F³F%FmE§ D§D,B¨B¬ BjBxBQBx B.BxA·B¶ A{C/A{CR A{CzAÃC¹ D¾F7 DDFrCDGi B(H}B(I4 B(IWBCIs B`I¯B¥I¯ C%I¯CCIl E!GsFWF· F³FxF³FI'
                         ],
        xMin           : 28,
        xMax           : 359,
        yMin           : 90.5,
        yMax           : 549,
        wdth           : 381
      };
      font["¿"]        = {
        sC             : [
                           'FkLf F¸LfG8LH GZL+GZK¤ GZKEG:J· F¹J^F^J^ E£J^E£KP E£K©E¼L2 F8LfFkLf',
                           'F4Ir F]IrF|IS F¼I4F¼H¯ F¼HJE¿Gh D3F6 C5EJC5Dq C5C¢CÂBÂ D©BBEzBB F6BBF¸B¤ GuC@G­C@ H2C@HOBÃ HmB£HmBX HmA®GWA? FQ@|Ez@| D5@|B·A· AuC-AuDq AuE¢BPFn BªG/C¿G½ E1H¨ElII E°IrF4Ir'
                         ],
        xMin           : 25,
        xMax           : 469,
        yMin           : -35.5,
        yMax           : 721.5,
        wdth           : 523.5
      };
      font["?"]        = {
        sC             : [
                           'Cw@| CK@|C(@» B©A5B©A_ B©A½C%BK CJB¥C¦B¥ DbB¥DbA² DbAYDGA. D(@|Cw@|',
                           'D,Co C§CoCfC° CGD,CGDS CGD¹DDEz F.G) G,G¸G,Hp G,IaFAJ@ E[JÀDhJÀ D*JÀCKJ_ BmIÂBVIÂ B.IÂA´J? AuJ`AuJª AuKTB­KÃ C²LfDhLf F,LfGLKL HmJ2HmHp HmGaG³Fs GYF0FEEF E0DZDvC¹ DSCoD,Co'
                         ],
        xMin           : 25,
        xMax           : 469,
        yMin           : -35.5,
        yMax           : 721.5,
        wdth           : 523.5
      };
      font["@"]        = {
        sC             : [
                           'K=DT JUDTI­Ds I?D³H´EL H]D»H*D¡ GyDdGHDd F]DdE|E< D¾E·D¾F¡ D¾H2F)IH G7J^HmJ^ H¸J^I0J? ILIÄILIw ILI;HkHÂ GiH{G2HJ FdG§FdF¡ FdFbF¡FG F¿F*GIF, GÁF0HgGJ I(HQIZHQ I¦HQIÀH2 J6G·J6Gi J6GUJ0G. J)F©J)Ft J)F3JaF" JwE¿K=E¿ LCE¿LyF^ M)F»M)GÃ M)I²KjK% J9L1HEL1 F)L1D«JZ CwH¾CwFz CwDnDÄC6 FSAwHkAw I9AwIÀA¸ KHBT KtBeK¢Be L&BeLEBD LcB#LcA{ Lc@ÀJµ@e Iv@9Hm@9 Gc@9FR@o EBA"D]A} B-C¥B-Fz B-IqC}Km EXMzHEMz J²MzL{L3 NrJbNrGÃ NrFDM©EN L¹DTK=DT'
                         ],
        xMin           : 53.5,
        xMax           : 855.5,
        yMin           : -68.5,
        yMax           : 795.5,
        wdth           : 931
      };
      font["["]        = {
        sC             : [
                           'Dp>/ DZ>/D.>- C¥>*Cl>* Bn>*Bn>À Bn@OB}DL B­HHB­I| B{L! BzL0 BxLUB³Ls C)L±CPL± CnL±D(L® DdL¬D¤L¬ D¶L¬E8L® E^L±EpL± FIL±FIL/ FIKXExKP E$KID1KM D7JwD7Iª D*Dy C½?k Dp?n D¯?nEE?k E¡?iE½?i FA?iFX?L Fp?0Fp>¬ Fp>cFX>F FA>*E½>* E¡>*EE>- D¯>/Dp>/'
                         ],
        xMin           : 85.5,
        xMax           : 342.5,
        yMin           : -204,
        yMax           : 742,
        wdth           : 376
      };
      font["]"]        = {
        sC             : [
                           'Dn>/ D§>/E0>- E]>*Er>* Fp>*Fp>À Fp@OFbDL FSHHFSI| FcL! FdL0 FfLUFLLs F3L±E°L± EpL±E4L® DzL¬D]L¬ DIL¬D#L® C£L±CnL± B¶L±B¶L/ B¶KXCfKP D8KIE-KM E%JwE%Iª E3Dy EB?k Dn?n DQ?nC»?k C`?iCB?i B¿?iB¨?L Bn?0Bn>¬ Bn>cB¨>F B¿>*CB>* C`>*C»>- DQ>/Dn>/'
                         ],
        xMin           : 85.5,
        xMax           : 342.5,
        yMin           : -204,
        yMax           : 742,
        wdth           : 376
      };
      font["{"]        = {
        sC             : [
                           'C>Er CuE®CÁFY DFG!DFG] DFG©D@I# D9JAD9Jl D9L+EBL: EdL;F$LD FkLSFkL« FkM;F2MZ E¦MuELMu D±MuDKMX B¬L¦B¬JO B±H¯ B´GJ B´G/ BaFÄAºF^ AGE¶AGEa AGE5B#Dt B£D1B£Cb B£CFByB´ BqB[BqB@ Bq@·CA?¡ D">KE@>K E¬>KF&>V FY>lFY?( FY?jF&?z E³?¤E@?¤ D~?¤DM@¨ D&AoD&B@ D&BbD/BÄ D7CcD7C¥ D7D0C®D£ CfEEC>Er'
                         ],
        xMin           : 2.5,
        xMax           : 340,
        yMin           : -187.5,
        yMax           : 793,
        wdth           : 366
      };
      font["}"]        = {
        sC             : [
                           'DtEr D=E®C¶FY ClG!ClG] ClG©CsI# CyJACyJl CyL+BpL: BNL;A°LD AGLSAGL« AGM;A£MZ B/MuBgMu C"MuCgMX E)L¦E)JO E#H¯ DÄGJ DÄG/ ERFÄE½F^ FkE¶FkEa FkE5E°Dt E1D1E1Cb E1CFE9B´ EAB[EAB@ EA@·Dq?¡ C²>KBr>K B)>KA®>V AY>lAY?( AY?jA®?z AÄ?¤Br?¤ C5?¤Cf@¨ C®AoC®B@ C®BbC¦BÄ C|CcC|C¥ C|D0D&D£ DLEEDtEr'
                         ],
        xMin           : 2.5,
        xMax           : 340,
        yMin           : -187.5,
        yMax           : 793,
        wdth           : 366
      };
      font["^"]        = {
        sC             : [
                           'E©M¬ F;M¬F©MG FÁM2GsLZ H¯K4 I&JºI&Jz I&JTH®J: HqIÂHMIÂ H,IÂG²J; GAJ¶E½L9 D!I¬C]I¬ C9I¬BÁJ$ B¦J@B¦Jd B¦J¨BÄK! CWKVEJMl EeM¬E©M¬'
                         ],
        xMin           : 96.5,
        xMax           : 498.5,
        yMin           : 547.5,
        yMax           : 803.5,
        wdth           : 581
      };
      font["_"]        = {
        sC             : [
                           'KM>r Hy>r H2>rG(>v EÀ>{EX>{ B$>{ A²>{Ac>v A5>r@Â>r @Â@$ A¤@$CD@& D«@(Ej@( F/@(G8@" HA?ÀH©?À KM@$ KM>r'
                         ],
        xMin           : -17.5,
        xMax           : 645.5,
        yMin           : -168.5,
        yMax           : -77,
        wdth           : 626.5
      };
      font[" "]        = {
        sC             : [
                         ],
        xMin           : 10000,
        xMax           : -10000,
        yMin           : 10000,
        yMax           : -10000,
        wdth           : 298.5
      };
      font[" "]        = {
        sC             : [
                         ],
        xMin           : 10000,
        xMax           : -10000,
        yMin           : 10000,
        yMax           : -10000,
        wdth           : 298.5
      };

      return font;


      function supplement(basis,extra,offsetX,offsetY){
        var glyph      = {
              xMin     : basis.xMin,
              xMax     : basis.xMax,
              yMin     : basis.yMin,
              yMax     : basis.yMax,
              wdth     : basis.wdth
            },
            shapes     = basis.sC.map(shape=>shape),
            holes      = typeof basis.hC === "object" ? basis.hC.map(hole=>hole) : undefined ,
            extraShapes= extra === "dieresis" ? 2 : 1 , 
            extraHoles = extra === "ring" ? 1 : 0 ;

        if ( extraShapes === 2 ) {
          if ( holes ) { holes.unshift([]) }
          if ( extra === "dieresis" ) { shapes.unshift(dieresisRightCoded(offsetX,offsetY)) }
        }
        if ( extraHoles ) {
          if ( typeof holes !== "object" ) {
            holes      = basis.sC.map(shape=>[])
          }
          if ( extra === "ring" ) {
            holes.unshift(ringHoleCoded(offsetX,offsetY)) 
          }
        } else {
          if ( holes ) { holes.unshift([]) }
        }

        if ( extra === "dieresis" )   { 
          glyph.yMax   = dieresisYmax(offsetY);
          shapes.unshift(dieresisLeftCoded(offsetX,offsetY))
        }
        if ( extra === "circumflex" ) {
          glyph.yMax   = circumflexYmax(offsetY);
          shapes.unshift(circumflexCoded(offsetX,offsetY)) 
        }
        if ( extra === "acute" )      { 
          glyph.yMax   = acuteYmax(offsetY);
          shapes.unshift(acuteCoded(offsetX,offsetY)) 
        }
        if ( extra === "grave" )      { 
          glyph.yMax   = graveYmax(offsetY);
          shapes.unshift(graveCoded(offsetX,offsetY)) 
        }
        if ( extra === "tilde" )      { 
          glyph.yMax   = tildeYmax(offsetY);
          shapes.unshift(tildeCoded(offsetX,offsetY))
        }
        if ( extra === "ring" )       { 
          glyph.yMax   = ringYmax(offsetY);
          shapes.unshift(ringCoded(offsetX,offsetY))
        }
        glyph.sC       = shapes;
        if ( holes ) {
          glyph.hC     = holes
        }
        return glyph     
      };
      //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  
      // To support non-english letters, we need a variety of new symbols: acute, dieresis, etc.
      // It turns out that these symbols can be re-used, with some placement changes
      // To save space and code, that's what we do
      // These functions return the special symbols in compressed or raw forms
      function acuteRaw(dx,dy){
        // "M 148 579.5 Q 130.5 579.5 117 593 Q 104 606.5 104 624.5 Q 104 641 119 656 Q 140 676.5 183 733.5 Q 215 775.5 254.5 803.5 Q 268 812.5 280.5 812.5 Q 298 812.5 311.5 799 Q 324.5 785 324.5 767.5 Q 324.5 748 306 733 Q 271.5 706 240 662.5 Q 207 616.5 177 591.5 Q 163.5 579.5 148 579.5 Z"
        return [[148+dx,579.5+dy],[130.5+dx,579.5+dy,117+dx,593+dy],[104+dx,606.5+dy,104+dx,624.5+dy],[104+dx,641+dy,119+dx,656+dy],[140+dx,676.5+dy,183+dx,733.5+dy],[215+dx,775.5+dy,254.5+dx,803.5+dy],[268+dx,812.5+dy,280.5+dx,812.5+dy],[298+dx,812.5+dy,311.5+dx,799+dy],[324.5+dx,785+dy,324.5+dx,767.5+dy],[324.5+dx,748+dy,306+dx,733+dy],[271.5+dx,706+dy,240+dx,662.5+dy],[207+dx,616.5+dy,177+dx,591.5+dy],[163.5+dx,579.5+dy,148+dx,579.5+dy]]
      };
      function acuteCoded(dx,dy){
        return codeList(acuteRaw(dx,dy))
      };
      function acuteYmax(y){return 812+y};

      function graveRaw(dx,dy){
        // "M 281.5 618.5 Q 281.5 601 267.5 588 Q 253.5 575 236 575 Q 215 575 201 595.5 L 152 668 Q 126 704 91.5 730.5 Q 72.5 745.5 72.5 765.5 Q 72.5 783 85.5 797 Q 98.5 811 116 811 Q 146 811 214.5 729.5 Q 281.5 649.5 281.5 618.5 Z"
        return [[281.5+dx,618.5+dy],[281.5+dx,601+dy,267.5+dx,588+dy],[253.5+dx,575+dy,236+dx,575+dy],[215+dx,575+dy,201+dx,595.5+dy],[152+dx,668+dy],[126+dx,704+dy,91.5+dx,730.5+dy],[72.5+dx,745.5+dy,72.5+dx,765.5+dy],[72.5+dx,783+dy,85.5+dx,797+dy],[98.5+dx,811+dy,116+dx,811+dy],[146+dx,811+dy,214.5+dx,729.5+dy],[281.5+dx,649.5+dy,281.5+dx,618.5+dy]]
      };
      function graveCoded(dx,dy){
        return codeList(graveRaw(dx,dy))
      };
      function graveYmax(y){return 811+y};

      function circumflexRaw(dx,dy){
        // "M 288 825 Q 314.5 825 352.5 792 Q 364 782 405.5 737.5 L 483 654.5 Q 496 640 496 625 Q 496 607 482.5 593.5 Q 469 580.5 451 580.5 Q 435 580.5 420 594.5 Q 381 638.5 298 721.5 Q 174 569 139 569 Q 121.5 569 108 583 Q 94.5 596.5 94.5 614 Q 94.5 631 109 645.5 Q 136.5 672 258 810 Q 271 825 288 825 Z"
        return [[288+dx,825+dy],[314.5+dx,825+dy,352.5+dx,792+dy],[364+dx,782+dy,405.5+dx,737.5+dy],[483+dx,654.5+dy],[496+dx,640+dy,496+dx,625+dy],[496+dx,607+dy,482.5+dx,593.5+dy],[469+dx,580.5+dy,451+dx,580.5+dy],[435+dx,580.5+dy,420+dx,594.5+dy],[381+dx,638.5+dy,298+dx,721.5+dy],[174+dx,569+dy,139+dx,569+dy],[121.5+dx,569+dy,108+dx,583+dy],[94.5+dx,596.5+dy,94.5+dx,614+dy],[94.5+dx,631+dy,109+dx,645.5+dy],[136.5+dx,672+dy,258+dx,810+dy],[271+dx,825+dy,288+dx,825+dy]]
      };
      function circumflexCoded(dx,dy){
        return codeList(circumflexRaw(dx,dy))
      };
      function circumflexYmax(y){return 825+y};

      function caronRaw(dx,dy){
        return [[284+dx,731+dy],[176+dx,588+dy],[65+dx,588+dy],[-42+dx,731+dy],[50+dx,731+dy],[120+dx,642+dy],[191+dx,731+dy]]
      };
      function caronCoded(dx,dy){
        return codeList(caronRaw(dx,dy))
      };
      function caronYmax(y){return 731+y};

      // "M 162 669.5 Q 226 669.5 226 618.5 Q 226 604 204.5 590 Q 185 578 167.5 578 Q 107.5 578 107.5 628 Q 107.5 642.5 126 656 Q 144.5 669.5 162 669.5 Z M 425 673.5 Q 441.5 673.5 458.5 658 Q 476 643 476 628 Q 476 583 406 583 Q 386 583 370.5 593.5 Q 353 605 353 624.5 Q 353 658 375 667.5 Q 387 673.5 425 673.5 Z"
      function dieresisLeftRaw(dx,dy){
        return [[162+dx,669.5+dy],[226+dx,669.5+dy,226+dx,618.5+dy],[226+dx,604+dy,204.5+dx,590+dy],[185+dx,578+dy,167.5+dx,578+dy],[107.5+dx,578+dy,107.5+dx,628+dy],[107.5+dx,642.5+dy,126+dx,656+dy],[144.5+dx,669.5+dy,162+dx,669.5+dy]]
      };
      function dieresisLeftCoded(dx,dy){
        return codeList(dieresisLeftRaw(dx,dy))
      };
      function dieresisRightRaw(dx,dy){
        return [[425+dx,673.5+dy],[441.5+dx,673.5+dy,458.5+dx,658+dy],[476+dx,643+dy,476+dx,628+dy],[476+dx,583+dy,406+dx,583+dy],[386+dx,583+dy,370.5+dx,593.5+dy],[353+dx,605+dy,353+dx,624.5+dy],[353+dx,658+dy,375+dx,667.5+dy],[387+dx,673.5+dy,425+dx,673.5+dy]]
      };
      function dieresisRightCoded(dx,dy){
        return codeList(dieresisRightRaw(dx,dy))
      };
      function dieresisYmax(y){return 707+y};

      function tildeRaw(dx,dy){
        // "M 221.5 758.5 Q 270.5 758.5 300 730 L 340.5 678.5 Q 363.5 650 395.5 650 Q 423 650 437 668 L 459 711 L 469 740 Q 476 754 498.5 754 Q 535 754 535 718 Q 535 700.5 514 659 Q 494.5 620 480 605 Q 453 577.5 410.5 577.5 Q 346.5 577.5 310.5 605 Q 297 615.5 267.5 657.5 Q 247 685.5 221.5 685.5 Q 206.5 685.5 194.5 679.5 Q 182.5 674 173.5 663 L 152 621.5 Q 140 599.5 120.5 599.5 Q 105 599.5 94 609.5 Q 83 619.5 83 634.5 Q 83 640 84 645.5 Q 98 695.5 133.5 726.5 Q 171.5 758.5 221.5 758.5 Z"
        return [[221.5+dx,758.5+dy],[270.5+dx,758.5+dy,300+dx,730+dy],[340.5+dx,678.5+dy],[363.5+dx,650+dy,395.5+dx,650+dy],[423+dx,650+dy,437+dx,668+dy],[459+dx,711+dy],[469+dx,740+dy],[476+dx,754+dy,498.5+dx,754+dy],[535+dx,754+dy,535+dx,718+dy],[535+dx,700.5+dy,514+dx,659+dy],[494.5+dx,620+dy,480+dx,605+dy],[453+dx,577.5+dy,410.5+dx,577.5+dy],[346.5+dx,577.5+dy,310.5+dx,605+dy],[297+dx,615.5+dy,267.5+dx,657.5+dy],[247+dx,685.5+dy,221.5+dx,685.5+dy],[206.5+dx,685.5+dy,194.5+dx,679.5+dy],[182.5+dx,674+dy,173.5+dx,663+dy],[152+dx,621.5+dy],[140+dx,599.5+dy,120.5+dx,599.5+dy],[105+dx,599.5+dy,94+dx,609.5+dy],[83+dx,619.5+dy,83+dx,634.5+dy],[83+dx,640+dy,84+dx,645.5+dy],[98+dx,695.5+dy,133.5+dx,726.5+dy],[171.5+dx,758.5+dy,221.5+dx,758.5+dy]]
      };
      function tildeCoded(dx,dy){
        return codeList(tildeRaw(dx,dy))
      };
      function tildeYmax(y){return 714+y};

      function ringHoleRaw(dx,dy){
        // "M 128 707.5 Q 128 778 178.5 819 Q 227 858 305.5 858 Q 366.5 858 410 824 Q 457.5 786.5 457.5 727 Q 457.5 654.5 413.5 617.5 Q 370 580.5 282.5 579 Q 216 578 172 616 Q 128 653.5 128 707.5 Z"
        return [
          [[290+dx,650.5+dy],[332+dx,652+dy,351.5+dx,662.5+dy],[384+dx,680+dy,384+dx,727+dy],[384+dx,755+dy,357.5+dx,771+dy],[335.5+dx,785.5+dy,305.5+dx,785.5+dy],[199.5+dx,785.5+dy,201.5+dx,707.5+dy],[202+dx,685+dy,231+dx,667+dy],[260.5+dx,649.5+dy,290+dx,650.5+dy]]
          // [[128+dx,707.5+dy],[128+dx,778+dy,178.5+dx,819+dy],[227+dx,858+dy,305.5+dx,858+dy],[366.5+dx,858+dy,410+dx,824+dy],[457.5+dx,786.5+dy,457.5+dx,727+dy],[457.5+dx,654.5+dy,413.5+dx,617.5+dy],[370+dx,580.5+dy,282.5+dx,579+dy],[216+dx,578+dy,172+dx,616+dy],[128+dx,653.5+dy,128+dx,707.5+dy]]
        ]
      };
      function ringHoleCoded(dx,dy){
        return [codeList(ringHoleRaw(dx,dy)[0])]
      };
      function ringRaw(dx,dy){
        // "M 290 650.5 Q 332 652 351.5 662.5 Q 384 680 384 727 Q 384 755 357.5 771 Q 335.5 785.5 305.5 785.5 Q 199.5 785.5 201.5 707.5 Q 202 685 231 667 Q 260.5 649.5 290 650.5 Z"
        // "M 290 650.5 Q 260.5 649.5 231 667 Q 202 685 201.5 707.5 Q 199.5 785.5 305.5 785.5 Q 335.5 785.5 357.5 771 Q 384 755 384 727 Q 384 680 351.5 662.5 Q 332 652 290 650.5 Z"
        // return [[290+dx,650.5+dy],[260.5+dx,649.5+dy,231+dx,667+dy],[202+dx,685+dy,201.5+dx,707.5+dy],[199.5+dx,785.5+dy,305.5+dx,785.5+dy],[335.5+dx,785.5+dy,357.5+dx,771+dy],[384+dx,755+dy,384+dx,727+dy],[384+dx,680+dy,351.5+dx,662.5+dy],[332+dx,652+dy,290+dx,650.5+dy]]
        return [[128+dx,707.5+dy],[128+dx,778+dy,178.5+dx,819+dy],[227+dx,858+dy,305.5+dx,858+dy],[366.5+dx,858+dy,410+dx,824+dy],[457.5+dx,786.5+dy,457.5+dx,727+dy],[457.5+dx,654.5+dy,413.5+dx,617.5+dy],[370+dx,580.5+dy,282.5+dx,579+dy],[216+dx,578+dy,172+dx,616+dy],[128+dx,653.5+dy,128+dx,707.5+dy]]
        // return [[290+dx,650.5+dy],[332+dx,652+dy,351.5+dx,662.5+dy],[384+dx,680+dy,384+dx,727+dy],[384+dx,755+dy,357.5+dx,771+dy],[335.5+dx,785.5+dy,305.5+dx,785.5+dy],[199.5+dx,785.5+dy,201.5+dx,707.5+dy],[202+dx,685+dy,231+dx,667+dy],[260.5+dx,649.5+dy,290+dx,650.5+dy]]
      };
      function ringCoded(dx,dy){
        return codeList(ringRaw(dx,dy))
      };
      function ringYmax(y){return 785+y};


      function dotlessiRaw(){
        // "M 183 221.5 Q 183 192 184.5 134 Q 186.5 75.5 186.5 46 Q 186.5 24.5 173 11 Q 160 -2.5 138.5 -2.5 Q 117.5 -2.5 104 11 Q 90.5 24.5 90.5 46 Q 90.5 75.5 89 134 Q 87 192 87 221.5 Q 87 267.5 92 336 Q 97 404.5 97 450.5 Q 97 472.5 110.5 486 Q 124 500 145 500 Q 166 500 179 486 Q 192.5 472.5 192.5 450.5 Q 192.5 404.5 187.5 336 Q 183 267.5 183 221.5 Z"        // "M 183 221.5 Q 183 192 184.5 134 Q 186.5 75.5 186.5 46 Q 186.5 24.5 173 11 Q 160 -2.5 138.5 -2.5 Q 117.5 -2.5 104 11 Q 90.5 24.5 90.5 46 Q 90.5 75.5 89 134 Q 87 192 87 221.5 Q 87 267.5 92 336 Q 97 404.5 97 450.5 Q 97 472.5 110.5 486 Q 124 500 145 500 Q 166 500 179 486 Q 192.5 472.5 192.5 450.5 Q 192.5 404.5 187.5 336 Q 183 267.5 183 221.5 Z"
        return [[183,221.5],[183,192,184.5,134],[186.5,75.5,186.5,46],[186.5,24.5,173,11],[160,-2.5,138.5,-2.5],[117.5,-2.5,104,11],[90.5,24.5,90.5,46],[90.5,75.5,89,134],[87,192,87,221.5],[87,267.5,92,336],[97,404.5,97,450.5],[97,472.5,110.5,486],[124,499.5,145,499.5],[166,499.5,179,486],[192.5,472.5,192.5,450.5],[192.5,404.5,187.5,336],[183,267.5,183,221.5]]
      };
      function dotlessiCoded(){
        return codeList(dotlessiRaw())
      };
    }
  }
);
