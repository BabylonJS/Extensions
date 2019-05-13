/*!
 * Babylon MeshWriter
 * https://github.com/briantbutton/meshwriter/blob/master/meshwriter.js
 * (c) 2018-2020 Brian Todd Button
 * Released under the MIT license
 */

(function(){

  const root                     = this;

  var HPB,HNM,CSN,JUR,WGD;

  //  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK 
  //
  //
  HPB                            = function(codeList){

      var hpb={reverseHoles:false,reverseShapes:true},nbsp="\u00A0";
      // Letters seems to go from about -250 to 850
      hpb["A"]                     = {
        sC                         : ["KPB, KPA}K-A[ J­A:JVA: I«A:IkA± IZB< H»CuH§Cw DgCw DVCwDTCk C¥A± C_A:B·A: B_A:B=A` A¿A§A¿B4 A¿BNB4B¥ E¥LR EÃLÃFoLÃ FoLÃ GNLÃGqL: KHBV KPB>KPB,"],
        hC                         : [["FwI} FuI}FsIy FqIu E0Ee E.EcE.E] E.ETE8ET H2ET H<ETH<E_ H<EcH:Ee F{Iu F{I}FwI}"]],
        xMin                       : 45,
        xMax                       : 647,
        yMin                       : -4,
        yMax                       : 751,
        width                      : 683
      };
      hpb["B"]                     = {
        sC                         : ["B6BZ B6K} B6LBB_Lq B©LÁCDLÁ E8LÁ FmLÁGdL) HZK4HZI© HZHiGwGo HTG2HªFP I:EoI:D{ I:C>H:B@ G:ABE}AB CDAB B©ABB_An B6A»B6BZ"],
        hC                         : [["CÃFP CÃC8 CÃC*D.C* EyC* FcC*F¼Cn GPD0GPD¥ GPETF¼E» FcF]EyF] D,F] CÃFZCÃFP","CÃK% CÃH> CÃH0D,H0 E6H0 E¹H2FGHq FyI.FyIw FyJ>FFJ{ E·K6E0K6 D.K6 CÃK6CÃK%"]],
        xMin                       : 58,
        xMax                       : 508,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 545
      };
      hpb["C"]                     = {
        sC                         : ["H#A2 EiA2C©B¶ B#DuB#G. B#IkC¨KL EgM.H#M. JDM.K¥K­ L@KTL@J¿ L@JkKÁJI K}J(KLJ( JÃJ(JuJN IgKDH!KD F@K@E&J% C±H¯C±G. C±E_E0D? FRBÃH#B½ IkBÁJuC³ K%D8KLD8 K}D8KÁC¹ L@CuL@CD L@B¯K£BT JFA2H#A2"],
        xMin                       : 49,
        xMax                       : 703,
        yMin                       : -8,
        yMax                       : 758,
        width                      : 741
      };
      hpb["D"]                     = {
        sC                         : ["EµAB C0AB B£ABB[Ad B6A§B6B4 B6KÃ B6LXBZL| B¡LÁC4LÁ EµLÁ HHLÁJ#KA K£IeK£G0 K£D{J$BÁ HJABEµAB"],
        hC                         : [["E¹K4 D,K4 CÃK4CÃK* CÃC6 CÃC*D,C* EµC* GmC*H¥D@ I»EVI»G0 I»H¯H¨IÃ GsK4E¹K4"]],
        xMin                       : 58,
        xMax                       : 671,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 708
      };
      hpb["E"]                     = {
        sC                         : ["HFB6 HFA£GÂAb GyABG@AB C*AB B6ABB6Ba B6K{ B6LÁC(LÁ GTLÁ G£LÁGÂL~ H>L]H>KÁ H>KsGÄKS G§K4GTK4 D,K4 CÃK4CÃK* CÃH2 CÃH(D,H( GTH( G¥H(H#G© HFGeHFG4 HFF¥H$Fa G§F>GTF> D,F> CÃF>CÃF4 CÃC6 CÃC*D,C* GTC* G¥C*H#B« HFBgHFB6"],
        xMin                       : 58,
        xMax                       : 450,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 488
      };
      hpb["F"]                     = {
        sC                         : ["HFG4 HFF¥H$Fa G§F>GTF> D,F> CÃF>CÃF2 CÃBV CÃA6C,A6 B6A6B6BV B6L* B6L_BWL¡ ByLÁC%LÁ GTLÁ G¡LÁGÂL¡ H@L_H@L2 H@K4G%K4 D,K4 CÃK4CÃK( CÃH4 CÃH(D,H( GTH( G¥H(H#G© HFGeHFG4"],
        xMin                       : 58,
        xMax                       : 450,
        yMin                       : -6,
        yMax                       : 750,
        width                      : 485
      };
      hpb["G"]                     = {
        sC                         : ["L¥FL L¥C¥ L¥C8LHB} K£B0JmAr IXA2H%A2 EiA2C«Bµ B(DsB(G0 B(IoC«KN EiM.H%M. J@M.K±K¡ LDKRLDJ¿ LDJmL!JI K£J%KVJ% K!J%J¡JF IoKDH%KD FJKDE-J( C³H¯C³G0 C³ETE-D7 FJB½H%B½ I:B½J)CK J»C}J»D2 J»ET J·EXJ³EX H@EX G³EXGqE{ GPE¿GPFL GPF¡GqFÂ G³G@H@G@ K]G@ L0G@LYG& L¥F±L¥FL"],
        xMin                       : 51,
        xMax                       : 736,
        yMin                       : -8,
        yMax                       : 758,
        width                      : 774
      };
      hpb["H"]                     = {
        sC                         : ["ILA: H¿A:H{AZ HXA{HXB* HXF0 HXF<HLF< D*F< CÁF<CÁF0 CÁB* CÁA{C~AZ C]A:C*A: B{A:BXAZ B6A{B6B* B6L4 B6LeBXL¨ B{M%C*M% C]M%C~L© CÁLgCÁL4 CÁH2 CÁH%D*H% HLH% HXH%HXH2 HXL4 HXLeH{L¨ H¿M%ILM% I¡M%IÂL© J@LgJ@L4 J@B* J@A{IÂAZ I¡A:ILA:"],
        xMin                       : 58,
        xMax                       : 575,
        yMin                       : -4,
        yMax                       : 754,
        width                      : 614
      };
      hpb["I"]                     = {
        sC                         : ["C*A: B{A:BXAZ B6A{B6B* B6L4 B6LcBXL§ B{M%C*M% C]M%C~L© CÁLgCÁL4 CÁB* CÁA}C~A[ C]A:C*A:"],
        xMin                       : 58,
        xMax                       : 174,
        yMin                       : -4,
        yMax                       : 754,
        width                      : 213
      };
      hpb["J"]                     = {
        xMin                       : 58,
        xMax                       : 174,
        yMin                       : -4,
        yMax                       : 754,
        width                      : 213
      };
      hpb["K"]                     = {
        sC                         : ["C*A: B6A:B6BT B6L4 B6L]B]L~ B¥LÁC,LÁ CcLÁC£Ly CÁLRCÁL( CÁG· CÁG¯D!G¯ G#Lo GBM!G¥M! H4M!HWL¢ H{L]H{L0 H{K±HiKu E­GJ E£G>E£G. E£F¿E­F± HiBk H{BNH{B0 H{B( HwA{HSA[ H0A<G¥A< GsA<GgA? GZABGRAE GJAHG?AS G4A_G0Ad G,AiFÂA{ FµA¯F¯Aµ D%FJ CÃFP CÁFPCÁB* CÁA}C~A[ C]A:C*A:"],
        xMin                       : 58,
        xMax                       : 476,
        yMin                       : -4,
        yMax                       : 752,
        width                      : 519
      };
      hpb["L"]                     = {
        sC                         : ["H2B6 H2A©G´Ae GqABG@AB C.AB B¡ABBZAa B6A¡B6B2 B6L8 B6LiBWL« ByM(C*M( C]M(C~L¬ CÁLkCÁL8 CÁC< CÁC*D0C* G@C* GsC*GµB¬ H2BiH2B6"],
        xMin                       : 50,
        xMax                       : 440,
        yMin                       : 0,
        yMax                       : 755,
        width                      : 474
      };
      hpb["M"]                     = {
        sC                         : ["G§DL J>KV J£M%K«M% MFM%MFJÁ MFB* MFA}M!A[ L¡A:LLA: KÁA:K¡AZ K_A{K_B% K_H£ K_IcK]Iµ KXIµK8I2 JÁHeJMF¢ I}D½I6CX HsA¹ HTA:G¡A: G!A:F©A· D_H£ D:IiD%I» D!I8D!H© D!B0 D!A¡C¤A] CaA:C.A: B¡A:BZA[ B6A}B6B* B6JÁ B6K³BjL[ B¿M%CuM% D.M%D`L¡ D³LVE!K» GuDL GwDDG}DD G¥DDG§DL"],
        xMin                       : 58,
        xMax                       : 770,
        yMin                       : -4,
        yMax                       : 754,
        width                      : 808
      };
      hpb["N"]                     = {
        sC                         : ["CRM% D4M#DmLJ IBDk IHD_IND_ IZD_IZDo IZL6 IZLgI|L© I¿M%JNM% J£M%K!L© KDLgKDL4 KDBZ KDA¿J¼Al JoA:J%A: J%A: IBA:H¯A¹ D8Is D2I}D,I} CÁI}CÁIm CÁB* CÁAyC¡AY C_A:C,A: B{A:BXAZ B6A{B6B* B6K§ B6LHBdLx B³M%CRM%"],
        xMin                       : 58,
        xMax                       : 641,
        yMin                       : -4,
        yMax                       : 754,
        width                      : 679
      };
      hpb["O"]                     = {
        sC                         : ["C«Bµ B(DsB(G0 B(IoC«KN EiM.H%M. JeM.LDKN N#IoN#G0 N#DsLDBµ JeA2H%A2 EiA2C«Bµ"],
        hC                         : [["E-J( C³H¯C³G0 C³ETE-D7 FJB½H%B½ I¥B½JÁD7 L:ETL:G0 L:H¯JÁJ( I¥KDH%KD FJKDE-J("]],
        xMin                       : 51,
        xMax                       : 817,
        yMin                       : -8,
        yMax                       : 758,
        width                      : 854
      };
      hpb["P"]                     = {
        sC                         : ["C(A: ByA:BWA^ B6A£B6B0 B6K§ B6LFB^Ls B§LÁCDLÁ EBLÁ F£LÁG|KÀ HwJ¿HwI] HwG½G|F¸ F£E³EBE³ D*E³ CÁE³CÁE§ CÁB0 CÁA¡C}A] CZA:C(A:"],
        hC                         : [["CÁK% CÁG§ CÁGyD.Gy E*Gy F!GyFXH? F±H©F±I] F±J.FXJs F!K6E*K6 D.K6 CÁK6CÁK%"]],
        xMin                       : 58,
        xMax                       : 474,
        yMin                       : -4,
        yMax                       : 750,
        width                      : 509
      };
      hpb["Q"]                     = {
        sC                         : ["LuAP L]AFLFAF L%AFK®AZ KqAoK<B% I§A2H%A2 EiA2C«Bµ B(DsB(G0 B(IoC«KN EiM.H%M. JeM.LDKN N#IoN#G0 N#D¹LmC> M(B§ MBBmMFB8 MFAµM/Av L»AXLuAP"],
        hC                         : [["E-J( C³H¯C³G0 C³ETE-D7 FJB½H%B½ I!B½I¹CT I±C]IyCr IcC©IZC² IRC»ICD) I4D:I-DF I%DRHÄDb H¿DqH¿D¡ H¿E,I@EQ IeEwI³Ew J:EwJ_ER KFDg L:EwL:G0 L:H¯JÁJ( I¥KDH%KD FJKDE-J("]],
        xMin                       : 51,
        xMax                       : 817,
        yMin                       : -8,
        yMax                       : 758,
        width                      : 854
      };
      hpb["R"]                     = {
        sC                         : ["HÃAL H¡A8H]A8 H2A8G»AQ G¡AkGaAÃ ENE© EHEµE:Eµ D*Eµ CÁEµCÁE© CÁBX CÁA:C%A: B4A:B4BZ B4K§ B4LFB[Ls B¥LÁC@LÁ EDLÁ G!LÁH#L% I%K.I%IV I%GFGDF8 G>F6G>F0 G>F.G>F. G@F* IJBZ IVBBIVB* IVAmHÃAL"],
        hC                         : [["CÁK% CÁGy CÁGkD,Gk ETGk G@GkG@IV G@J2F­Ju FTK6ETK6 D,K6 CÁK6CÁK%"]],
        xMin                       : 57,
        xMax                       : 522,
        yMin                       : -5,
        yMax                       : 750,
        width                      : 563
      };
      hpb["S"]                     = {
        sC                         : ["B%CZ B%C«BDD( BcDHB­DH C.DHCKD6 CiD#C¢C­ C¹CqD/CV DHC<DpC* D¹B»EFB» E³B»FJCT F§C³F§D_ F§D_ F§EDFDE{ E§F0D³FZ C]F¿B¥G¤ B(HgB(I£ B(K:BÃL3 C»M,EPM, FDM,G*Lp G³L2H<KJ HFK0HFJ½ HFJkH#JG G¥J#GRJ# F³J#FmJe F6KBEHKB D£KBDIJ® CµJTCµI¯ CµIsC»I[ CÁIDD$I3 D,I!D>H´ DPH£DYHx DcHoD¡Ha D½HRE#HM E.HHEPH: EsH,E}H( G@GRG¸Fn HkE«HkD_ HkC.GpB0 FuA2ELA2 D#A2C$A­ B%BcB%CZ"],
        xMin                       : 50,
        xMax                       : 468,
        yMin                       : -8,
        yMax                       : 757,
        width                      : 505
      };
      hpb["T"]                     = {
        sC                         : ["I%Ly IPLRIPL% IPK{I.KW H¯K4HaK4 FuK4 FgK4FgK! FgB% FgAyFDAY F!A:EsA: E@A:DÁAX D}AwD}B% D}K( D}K4DqK4 B©K4 BZK4B8KW A¹K{A¹L% A¹LNB9Lw B]LÁB©LÁ HaLÁ H}LÁI%Ly"],
        xMin                       : 42,
        xMax                       : 519,
        yMin                       : -4,
        yMax                       : 750,
        width                      : 556
      };
      hpb["U"]                     = {
        sC                         : ["B0Dm B0L4 B0LeBRL¨ BuM%C%M% CXM%CzL© C½LgC½L4 C½D­ C½D%DbCc E(BÁE­BÁ FkBÁG/Cb GuD#GuD§ GuL4 GuLeG¹L¨ H8M%HkM% H¿M%I=L© I_LgI_L4 I_Dk I_C2HSB4 GHA6E­A6 DJA6C=B5 B0C4B0Dm"],
        xMin                       : 56,
        xMax                       : 526,
        yMin                       : -6,
        yMax                       : 754,
        width                      : 564
      };
      hpb["V"]                     = {
        sC                         : ["JµL2 JµKÃJ­K« GHA¯ G,A>F_A> E¡A>EcA¯ B!K« A½KÃA½L2 A½LcB<L§ B_M%BµM% C8M%CVL± CuLwC£LP FPDe FRDc FRDaFSD` FTD_FVD_ FZD_FZDe I,LP I6LwITL± IsM%I»M% JLM%JpL§ JµLcJµL2"],
        xMin                       : 44,
        xMax                       : 616,
        yMin                       : -2,
        yMax                       : 754,
        width                      : 652
      };
      hpb["W"]                     = {
        sC                         : ["KBA: JoA>JPA¹ J@BV HsH³HeH³ F¥A¹ FgA:E±A: E2A>D¿A¹ BNKo B:L:BZLj B{L»C@L» C³L»D(LB D4K³ E¥E0E±E0 EµE0FDF| FwHFG0J5 GkL#GwLR G¯M#HiM# IDM#IaL8 I³J{JMH« J­F¹K%F! KDE0 KFE0KHE6 M*L< MBL»M»L» NRL»NwLk N½L<N«K{ L6A¹ KÁA:KBA:"],
        xMin                       : 70,
        xMax                       : 867,
        yMin                       : -4,
        yMax                       : 753,
        width                      : 903
      };
      hpb["X"]                     = {
        xMin                       : 51,
        xMax                       : 525,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 563
      };
      hpb["Y"]                     = {
        xMin                       : 51,
        xMax                       : 525,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 563
      };
      hpb["Z"]                     = {
        sC                         : ["B,BT B,B{BHC( G.JÁ G2K%G2K* G2K4F¿K4 CLK4 B(K4B(L( B(LÁCNLÁ H>LÁ HyLÁI$Ls IRLFIRK¯ IRKiI<K@ DTCF DLC6 DLC*DcC* H6C* I]C*I]B8 I]A©I;Ae H½ABHkAB CsAB BÃABBgAf B,A«B,BT"],
        xMin                       : 51,
        xMax                       : 525,
        yMin                       : 0,
        yMax                       : 750,
        width                      : 563
      };
      hpb["a"]                     = {
        sC                         : ['H@HR HLHqHRH| HXH©HrH¸ H­I#I2I# IµI#IµG£ IµBk IµADI4AD H§ADHmAW HTAkH@A» G6A2E±A2 D8A2BÃBI A«CaA«E6 A«F¯BÃH" D8I:E±I: G4I:H@HR'],
        hC                         : [['D<F« CgF2CgE6 CgD:D<Ce DµB±E±B± F­B±G`Ce H4D:H4E6 H4F2G`F« F­G_E±G_ DµG_D<F«']],
        xMin                       : 35,
        xMax                       : 552,
        yMin                       : -8,
        yMax                       : 508,
        width                      : 584
      };
      hpb["b"]                     = {
        sC                         : ['C{A» CaA:B¹A: BgA<BGA_ B(A£B(B4 B(KF B(K¡BFKÃ BeLBB¹LB CFLBCfKÄ C§K£C§KF C§KF C§HX D­I:F,I: G¥I:H½H" J2F¯J2E6 J2CaH½BI G¥A2F,A2 D£A2C{A»'],
        hC                         : [['G¡Ce HTD:HTE6 HTF2G¡F« G(G_F,G_ E0G_D[F« C©F2C©E6 C©D:D[Ce E0B±F,B± G(B±G¡Ce']],
        xMin                       : 51,
        xMax                       : 568,
        yMin                       : -8,
        yMax                       : 704,
        width                      : 597
      };
      hpb["c"]                     = {
        sC                         : ["E½B³ FÃB³G¥C¥ HTDaH©Da I2DaIND@ IkCÃIkCw IkCgIcCN I!BLH&A¢ G,A2E»A2 D@A2C)BI AµCaAµE8 AµF±C)H# D@I:E»I: F·I:G¥H~ HqH@I:Ga IRGBIRF» IRFoI4FR H¹F6HmF6 HNF6G¿FZ G*G]E½G] DÁG]DHFª CsF2CsE8 CsD<DHCg DÁB³E½B³"],
        xMin                       : 40,
        xMax                       : 532,
        yMin                       : -8,
        yMax                       : 508,
        width                      : 559
      };
      hpb["d"]                     = {
        sC                         : ['I%A: HXA:HBA» G>A2E³A2 D:A2C"BI A¯CaA¯E6 A¯F¯C"H" D:I:E³I: G6I:H8HX H8KF H8K£HWKÄ HwLBI%LB IZLBIyKÃ I¹K¡I¹KF I¹B4 I¹A£IwA^ IVA:I%A:'],
        hC                         : [['D>F« CiF2CiE6 CiD:D>Ce D·B±E³B± F¯B±GcCe H8D:H8E6 H8F2GcF« F¯G_E³G_ D·G_D>F«']],
        xMin                       : 37,
        xMax                       : 554,
        yMin                       : -8,
        yMax                       : 704,
        width                      : 585
      };
      hpb["e"]                     = {
        sC                         : ["E³A2 D8A2BÄBI A­CaA­E8 A­F±BÄH# D8I:E³I: GVI:HsH, I±FÁI±E] I±E.IoD¯ INDkI!Di D:Di D!DiCwDe C³C§D_CE E,B©E³B© F#B©F8B« FLB­F[B° FkB³F¡Bº FµBÁF¾BÄ G#C#G8C/ GLC:GRC= GXC@GoCM G§CZG©C] H%CqH8Cq HcCqH~CT H»C8H»Bµ H»B2G´As F­A2E³A2"],
        hC                         : [['E³G] E0G]D^G" C­FkC{E¹ D!EµD6Eµ GiEµ GuEµGªE¶ G½E·H#E· G·FiGAG! FoG]E³G]']],
        xMin                       : 36,
        xMax                       : 561,
        yMin                       : -234,
        yMax                       : 508,
        width                      : 594
      };
      hpb["f"]                     = {
        sC                         : ["B¹I! CaI! CaIµ CaJÁD3Ks D©LFE§LF EµLF F©LFGVK¤ H%K<H%Jw H%JRG®J8 GqIÁGLIÁ G!IÃFuJR FFJ§EÁJ© EµJ© E>J©E>I© E>I! F£I! G­I!G­H: G­GZF£GZ E>GZ E>BZ E>A6DPA6 CaA6CaBZ CaGZ B¹GZ A£GZA£H@ A£I!B¹I!"],
        xMin                       : 31,
        xMax                       : 434,
        yMin                       : -6,
        yMax                       : 706,
        width                      : 450
      };
      hpb["g"]                     = {
        sC                         : ['B³>± Bo?0Bo?_ Bo?©B¯@# C*@BCV@B C£@BD(?½ D«?:E±?: F¹?:Gp?Ã HH@©HHA· GDA4EÃA4 DJA4C2BK A½CcA½E6 A½F¯C2H" DJI:EÃI: GLI:HRHT H_HsH§H± I*I*IJI* IsI*IªH¯ I¿HoIÃHO J#H0J#G£ J#A« J#@*Hª>¯ Gk=oE­=o D*=oB³>±'],
        hC                         : [['DVF« C£F2C£E6 C£D:DVCe E,B±F(B± G#B±G{Ce HPD:HPE6 HPF2G{F« G#G_F(G_ E,G_DVF«']],
        xMin                       : 36,
        xMax                       : 550,
        yMin                       : -8,
        yMax                       : 508,
        width                      : 577
      };
      hpb["h"]                     = {
        sC                         : ["B(B. B(K% B(LBB»LB C§LBC§K( C§H¡ DkI:E_I: FÃI:G¿HD H»GNH»E³ H»BV H»AµH}Ag HaA:H,A: G<A:G<Bu G<Ee G<FLF£F¸ FDG_EaG_ D¥G_DCG& C§FqC§E© C§B4 C§A¥CgA_ CHA:B·A: B¥A:BwA@ BsA@ B]A@BJAV BDA] B(AyB(B."],
        xMin                       : 51,
        xMax                       : 491,
        yMin                       : -4,
        yMax                       : 704,
        width                      : 524
      };
      hpb["i"]                     = {
        sC                         : ["B!B4 B!H6 B!HoBBH³ BcI2BµI2 C@I2CaH³ C£HoC£H6 C£B4 C£A}CaA[ C@A:BµA: BcA:BBA[ B!A}B!B4","BµI¹ BeI¹BCJ7 B!JXB!J© B!K2BCKR BeKsBµKs C>KsC`KQ C£K0C£J© C£JXC`J7 C>I¹BµI¹"],
        xMin                       : 48,
        xMax                       : 159,
        yMin                       : -4,
        yMax                       : 664,
        width                      : 191
      };
      hpb["j"]                     = {
        sC                         : ["C:I¹ B¯I¹BlJ7 BJJXBJJ© BJK2BlKR B¯KsC:Ks CeKsC©KQ D(K0D(J© D(JXCªJ7 CgI¹C:I¹","D%H8 D%?L D%>]Cd>$ BÃ=oB@=o B:=o A«=oAh=° AF>,AF>_ AF>£A[>º Aq?.A«?9 AÃ?DB5?_ BJ?yBJ?Á BJH8 BJHqBkHµ B­I4C:I4 CiI4CªHµ D%HqD%H8"],
        xMin                       : 2,
        xMax                       : 179,
        yMin                       : -234,
        yMax                       : 664,
        width                      : 211
      };
      hpb["k"]                     = {
        sC                         : ["C±E· EqHk EÁI2F_I2 F¯I2G*Hµ GHHsGHHJ GHH.G8Gµ EVEB EZE:E¡D¥ G:B_ GJBBGJB% GJA{G+A] F¯A>F_A> F!A>E§Am C³Dk C­DuC«Du C§DuC§Dm C§BZ C§A·CiAh CLA:B»A: BZA:BAAc B(A­B(BZ B(K! B(LBB»LB C§LBC§K! C§E¯C«E¯ C­E¯C±E·"],
        xMin                       : 51,
        xMax                       : 388,
        yMin                       : -4,
        yMax                       : 704,
        width                      : 417
      };
      hpb["l"]                     = {
        // shapeCmds                  : [[[51,57],[51,642],[51,671,67,687.5],[83,704,107,704],[130,704,145.5,687.5],[161,671,161,642],[161,57],[161,29,145.5,12.5],[130,-4,107,-4],[83,-4,67,12.5],[51,29,51,57]]],
        sC                         : ['B(B4 B(KF B(K£BHKÄ BiLBB»LB CFLBCfKÄ C§K£C§KF C§B4 C§A}CfA[ CFA:B»A: BiA:BHA[ B(A}B(B4'],
        xMin                       : 51,
        xMax                       : 161,
        yMin                       : -4,
        yMax                       : 704,
        width                      : 194
      };
      hpb["m"]                     = {
        sC                         : ['G<B4 G<E¥ G<FZF{F¿ F8G_EaG_ D¥G_DCG* C§FwC§E± C§Bi C§A:B»A: BVA:BAAd B,A¯B%Bk B%G« B%I6B¹I6 C6I6CQI" CmH³CwHu DTI:E_I: G*I:H*H4 I%I:JuI: L6I:M2HD N.GNN.E³ N.Bk N.A:M@A: LPA:LPBi LPE¥ LPFZK²F¿ KNG_JuG_ IÁG_I[G! H»FgH¹Eµ H¹Bk H¹A:H,A: G}A:G]A[ G<A}G<B4'],
        xMin                       : 50,
        xMax                       : 822,
        yMin                       : -4,
        yMax                       : 508,
        width                      : 854
      };
      hpb["n"]                     = {
        sC                         : ['G<B4 G<E¥ G<FZF{F¿ F8G_EaG_ EaG_ D§G_DDG) C§FuC§E¯ C§Bi C§A:B»A: BVA:BAAd B,A¯B%Bk B%G« B%I6B¹I6 C6I6CQI" CmH³CwHu DTI:E_I: FÃI:G¿HD H»GNH»E³ H»Bk H»A·H¤Ah HkA:H,A: G}A:G]A[ G<A}G<B4'],
        xMin                       : 50,
        xMax                       : 491,
        yMin                       : -4,
        yMax                       : 508,
        width                      : 523
      };
      hpb["o"]                     = {
        // shapeCmds                  : [[[40,251],[40,358,115.5,433],[191,508,299,508],[406,508,481,433],[556,358,556,251],[556,143,481,67.5],[406,-8,299,-8],[191,-8,115.5,67.5],[40,143,40,251]]],
        sC                         : ['AµE8 AµF±C)H# D@I:E»I: GoI:H§H# I½F±I½E8 I½CaH§BI GoA2E»A2 D@A2C)BI AµCaAµE8'],
        // holeCmds                   : [[[[151,251],[151,189,194,146],[237,103,299,103],[360,103,402.5,146],[445,189,445,251],[445,312,402.5,354.5],[360,397,299,397],[237,397,194,354.5],[151,312,151,251]]]],
        hC                         : [['CqE8 CqD<DFCg D¿B³E»B³ FµB³GhCg H<D<H<E8 H<F2GhFª FµG]E»G] D¿G]DFFª CqF2CqE8']],
        xMin                       : 40,
        xMax                       : 556,
        yMin                       : -8,
        yMax                       : 508,
        width                      : 581
      };
      hpb["p"]                     = {
        // shapeCmds                  : [[[106,504],[147,504,156,457],[223,508,309,508],[416,508,492,432.5],[568,357,568,250],[568,144,492,68.5],[416,-7,309,-7],[227,-7,161,41],[161,-142],[161,-170,145,-187],[129,-204,106,-204],[81,-204,66,-186.5],[51,-169,51,-142],[51,443],[51,469,67,486.5],[83,504,106,504]]],
        sC                         : ['B¹I2 CiI2C{HT D£I:F,I: G¥I:H½H" J2F¯J2E6 J2CcH½BK G¥A4F,A4 D«A4C§A· C§?% C§>oCe>L CD>*B¹>* Be>*BF>M B(>qB(?% B(H8 B(HmBHH² BiI2B¹I2'],
        // holeCmds                   : [[[[414,145],[457,188,457,250],[457,312,414,355],[371,398,309,398],[247,398,204.5,355],[162,312,162,250],[162,188,204.5,145],[247,102,309,102],[371,102,414,145]]]],
        hC                         : [['G¡Ce HTD:HTE6 HTF2G¡F« G(G_F,G_ E0G_D[F« C©F2C©E6 C©D:D[Ce E0B±F,B± G(B±G¡Ce']],
        xMin                       : 51,
        xMax                       : 568,
        yMin                       : -204,
        yMax                       : 508,
        width                      : 597
      };
      hpb["q"]                     = {
        // shapeCmds                  : [[[448,457],[461,504,499,504],[499,504],[522,504,538,486.5],[554,469,554,443],[554,-142],[554,-170,539,-187],[524,-204,498,-204],[475,-204,459,-187],[443,-170,443,-142],[443,41],[379,-7,295,-7],[188,-7,112.5,68],[37,143,37,250],[37,357,112.5,432.5],[188,508,295,508],[382,508,448,457]]],
        sC                         : ['HBHT H]I2I(I2 I(I2 IVI2IwH² I¹HmI¹H8 I¹?% I¹>oIy>L IZ>*I%>* Hy>*HX>L H8>oH8?% H8A· G8A4E³A4 D:A4C"BJ A¯CaA¯E6 A¯F¯C"H" D:I:E³I: G>I:HBHT'],
        // holeCmds                   : [[[[190,355],[147,312,147,250],[147,188,190,145],[233,102,295,102],[357,102,400,145],[443,188,443,250],[443,312,400,355],[357,398,295,398],[233,398,190,355]]]],
        hC                         : [['D>F« CiF2CiE6 CiD:D>Ce D·B±E³B± F¯B±GcCe H8D:H8E6 H8F2GcF« F¯G_E³G_ D·G_D>F«']],
        xMin                       : 37,
        xMax                       : 554,
        yMin                       : -204,
        yMax                       : 508,
        width                      : 585
      };
      hpb["r"]                     = {
        // shapeCmds                  : [[[351,454],[351,394,290,394],[284,394,277,395],[270,396,259,396],[218,396,189.5,369.5],[161,343,161,291],[161,90],[161,-4,107,-4],[50,-4,50,74],[50,429],[50,504,104,504],[145,504,157,451],[215,506,278,506],[310,506,330.5,490],[351,474,351,454]]],
        sC                         : ['F£HN F£GVE©GV E{GVEmGX E_GZEHGZ DwGZD=G$ C§FqC§E« C§Bw C§A:B»A: B%A:B%BV B%G¿ B%I2BµI2 CeI2C}HH DqI6EoI6 F.I6FWH¹ F£HwF£HN'],
        xMin                       : 50,
        xMax                       : 351,
        yMin                       : -4,
        yMax                       : 506,
        width                      : 372
      };
      hpb["s"]                     = {
        sC                         : ["G4CP G4B]FYAª E¡A2DZA2 CPA2BtAp A¹B,A¹B{ A¹C!B2C= BNCXB{CX C#CXCgC+ D(B¡DcB¡ D»B¡E4B¹ EPC.EPCN EPC³DLDT CoD§ B¡E<BOE¤ AÃFFAÃG! AÃGµB~Hf CZI8DoI8 E¡I8FMHw F¿H4F¿Gy F¿GRF¤G8 FgFÁF:FÁ E·FÁEOGA D­GeDVGe D2GeCÀGO C«G:C«FÃ C«F£CÀFk D2FTDuF. D¯EÃ D¿E¹EAE§ EgEsEwEi G4D¥G4CP"],
        xMin                       : 50,
        xMax                       : 351,
        yMin                       : -4,
        yMax                       : 506,
        width                      : 372
      };
      hpb["t"]                     = {
        // shapeCmds                  : [[[102,496],[160,496],[160,563],[160,644,216,644],[270,644,270,563],[270,496],[327,496],[400,496,400,447],[400,396,327,396],[270,396],[270,81],[270,-4,216,-4],[216,-4],[184,-4,172,17],[160,38,160,81],[160,396],[102,396],[67,396,49,406.5],[31,417,31,443],[31,472,48.5,484],[66,496,102,496]]],
        sC                         : ['B±I! C¥I! C¥J( C¥KJDsKJ E_KJE_J( E_I! FPI! GcI!GcH@ GcGZFPGZ E_GZ E_Be E_A:DsA: DsA: D2A:C½Ae C¥A±C¥Be C¥GZ B±GZ BHGZB#Gp A£G§A£H8 A£HsB"H­ BFI!B±I!'],
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 425
      };
      hpb["u"]                     = {
        // shapeCmds                  : [[[158,442],[158,213],[158,168,191,135.5],[224,103,268,103],[315,103,346.5,129],[378,155,378,207],[378,417],[378,504,432,504],[465,504,475.5,483],[486,462,489,416],[489,81],[489,-5,433,-5],[397,-5,385,28],[337,-8,269,-8],[172,-8,110,51.5],[48,111,48,206],[48,416],[48,458,59.5,481],[71,504,102,504],[126,504,142,487.5],[158,471,158,442]]],
        sC                         : ['C¡H6 C¡Dm C¡CµD@CQ D¥B³EZB³ F8B³FxCD G6CyG6Da G6G§ G6I2H!I2 HeI2HzH« H±H_H·G¥ H·Be H·A8H#A8 G]A8GDA{ FeA2E]A2 C½A2BÁB) B!BÃB!D_ B!G¥ B!HVB9H§ BPI2B±I2 C>I2C_H´ C¡HqC¡H6'],
        xMin                       : 48,
        xMax                       : 489,
        yMin                       : -8,
        yMax                       : 504,
        width                      : 521
      };
      hpb["v"]                     = {
        // shapeCmds                  : [[[182,34],[43,431],[39,443,39,450],[39,473,55.5,489],[72,505,95,505],[119,505,132,489],[145,473,155,443],[223,226],[232,196,238,181],[252,219,265.5,262.5],[279,306,295.5,361],[312,416,320,443],[330,473,343,489],[356,505,380,505],[380,505],[403,505,420,488.5],[437,472,437,450],[437,443,433,431],[294,34],[280,-4,238,-4],[195,-4,182,34]]],
        sC                         : ['D.A© A»GÃ A³H8A³HF A³HuB1H· BRI4B£I4 C0I4CJH· CeHuCyH8 D£D© DµDJDÁD, E:DyEUEO EqF%E´F· F2G¥FBH8 FVHuFqH· F­I4G:I4 G:I4 GiI4G­H¶ H,HsH,HF H,H8H#GÃ E±A© EsA:DÁA: DHA:D.A©'],
        xMin                       : 39,
        xMax                       : 437,
        yMin                       : -4,
        yMax                       : 505,
        width                      : 465
      };
      hpb["w"]                     = {
        sC                         : ["C§A³ AµH* A±H.A±H@ A±HiB,H¬ BJI*B}I* CPI*CgHk CyH0 DeD»D±C» F<H_ FTI2G(I2 GLI2GkHÀ G«H«GµHg H#H, I(DoIDCÁ IFCÁIFCÃ JiHk JqH©J¯H» K(I*KNI* K§I*L!H° L@HqL@HB L@H:L<H* JHA± J.A:IXA: H{A:H]A³ HNB8G¨C¸ G<EsG%F. G#F, EsA± ERA:DuA: CÁA:C§A³"],
        xMin                       : 38,
        xMax                       : 703,
        yMin                       : -4,
        yMax                       : 504,
        width                      : 730
      };
      hpb["x"]                     = {
        sC                         : ["D©Cu D¡CmDsCX CyA§ CRA:B¯A: B]A:B<A[ A¿A}A¿B( A¿BBB>B{ C§E4 B>Go A¿GÃA¿H@ A¿HoB=H² B_I0B¯I0 C:I0CZH³ CyHe DsF³ D¡F}D©Fu D±F}D½F³ E¹He FDI0F¥I0 G4I0GRH¯ GqHiGqH8 GmH#GiG¿ GPGo EÁEV E½EPE¯E4 E±E0E·E$ E½D½EÁD· GeBa GuBDGuB* GuA{GRAZ G0A:F§A: FBA:E¹A§ D¯Cs D­CuD©Cu"],
        xMin                       : 45,
        xMax                       : 409,
        yMin                       : -4,
        yMax                       : 503,
        width                      : 435
      };
      hpb["y"]                     = {
        sC                         : ["G·GÃ D§?! De>JDJ>4 D2>!C±>! C_>!C>>B BÁ>cBÁ>µ BÁ?#C%?8 C·Aq C¯A·C©B% C©B. A£GÃ AyH8AyHF AyHuA»H· B8I4BiI4 B½I4C2H¶ CJHsC_H6 DkD¥ D§D4D­D% D³D4E*D¥ F6H6 FBH_FMHv FXH¯FrHÃ F­I4G,I4 G_I4G~H¶ G¿HsG¿HF G¿H8G·GÃ"],
        xMin                       : 27,
        xMax                       : 429,
        yMin                       : -208,
        yMax                       : 505,
        width                      : 457
      };
      hpb["z"]                     = {
        // shapeCmds                  : [[[342,0],[130,0],[48,0,48,58],[48,58],[48,82,60,99],[226,347],[254,389],[231,393,196,393],[102,393],[82,393,65,409],[48,425,48,447],[48,469,64,484.5],[80,500,102,500],[312,500],[350,500,373,484],[396,468,396,439],[396,426,390,415],[372,384],[358,360,283,251.5],[208,143,190,110],[206,107,247,107],[342,107],[362,107,379,91],[396,75,396,54],[396,32,380,16],[364,0,342,0]]],
        sC                         : ['FoAB CFAB B!ABB!B6 B!B6 B!BgB:B« D©Fy E>GL D³GTDJGT B±GT BgGTBDGu B!G·B!H@ B!HmBBH® BcI*B±I* F2I* F¡I*G,H­ GZHkGZH0 GZG¹GNG£ G*GB F±FµEyE9 DcCaD>BÁ D_B»E0B» FoB» F¹B»G8By GZBXGZB. GZA¥G:Ac F½ABFoAB'],
        xMin                       : 48,
        xMax                       : 396,
        yMin                       : 0,
        yMax                       : 500,
        width                      : 426
      };
      hpb["0"]                     = {
        // shapeCmds                  : [[[475,66.5],[401,-8,300,-8],[199,-8,124.5,65],[50,138,50,241],[50,508],[50,608,124,682.5],[198,757,300,757],[399,757,474,685],[549,613,549,508],[549,241],[549,141,475,66.5]]],
        sC                         : ['HyBG GeA2E½A2 DPA2C;BD B%CVB%E# B%I: B%J¥C:Kº DNM,E½M, GaM,HwK¿ I¯J¯I¯I: I¯E# I¯C]HyBG'],
        // holeCmds                   : [[[[300,639],[245,639,205,598.5],[165,558,165,506],[165,243],[165,190,205,149.5],[245,109,300,109],[354,109,393,149],[432,189,432,243],[432,506],[432,560,393,599.5],[354,639,300,639]]]],
        hC                         : [['E½K@ E,K@D]Jp C¯IÁC¯I6 C¯E( C¯D>D]Cn E,B¿E½B¿ F©B¿GTCm H!D<H!E( H!I6 H!J!GTJr F©K@E½K@']],
        xMin                       : 50,
        xMax                       : 549,
        yMin                       : -8,
        yMax                       : 757,
        width                      : 600
      };
      hpb["1"]                     = {
        // shapeCmds                  : [[[390,12.5],[373,-4,348,-4],[323,-4,306.5,12.5],[290,29,290,53],[290,633],[290,643,281,643],[228,643],[205,643,189.5,658.5],[174,674,174,696],[174,719,189.5,734.5],[205,750,227,750],[361,750],[381,750,394,736],[407,722,407,701],[407,53],[407,29,390,12.5]]],
        sC                         : ['GNA[ G,A:F{A: FHA:F&A[ E©A}E©B, E©K4 E©KHEuKH D­KH D]KHD=Kh CÁK©CÁL2 CÁLaD=L¢ D]LÁD«LÁ F·LÁ G<LÁGVL¥ GqLgGqL< GqB, GqA}GNA['],
        xMin                       : 174,
        xMax                       : 407,
        yMin                       : -4,
        yMax                       : 750,
        width                      : 600
      };
      hpb["2"]                     = {
        sC                         : ["HµAB C_AB B¹ABBeAn B2A»B2Ba B2C!BeCX BuCkC¡Dh D«EeE¸Fl G!GsGPH4 G¹H«G¹IT G¹J6GPJ} F­KBF(KB EXKBD¾J· D_JgDDI¿ D8I{C»Ie CyINCTIN C%INB§Iq BcIµBcJB BcJVBiJi B¹KwCµLP D±M*F(M* GkM*HuKÃ I¡J¹I¡IT I¡H³I_HD I>GyHºG> HqF§H!F4 GTEeG$E: FwD³E¼D? E<CoDÃCV D«C@ D{C4D{C0 D{C*D¥C* HµC* I2C*I]B§ I©B_I©B4 I©A©IdAe I@ABHµAB"],
        xMin                       : 56,
        xMax                       : 546,
        yMin                       : 0,
        yMax                       : 756,
        width                      : 600
      };
      hpb["3"]                     = {
        sC                         : ["BBD> BBDqB`D· B}E8C.E8 CTE8CvDÂ C¹D©CÃD_ D6C«DxCP E8B»EµB» FwB»G?Ce G«D0G«D¿ G«E§GFFY F§G.F#G6 EwG>EWG^ E8G}E8H% E8HREUHp EsH¯E¹H¾ F:I*FWIR FuI{FuJ: FuJwFYJ¾ F>K@E­K@ ENK@D®J¥ DHJDC¿JD CwJDCUJl C4JµC4K< C4KgCBK¡ D6M.E©M. F±M.GsLI HVKeHVJL HVI@GwHB H%H! IqFµIqDµ IqCLHeB? GXA2EµA2 DgA2CXB& BJB¿BBD>"],
        xMin                       : 64,
        xMax                       : 535,
        yMin                       : -8,
        yMax                       : 758,
        width                      : 600
      };
      hpb["4"]                     = {
        // shapeCmds                  : [[[561,181],[561,154,542.5,141],[524,128,505.5,125.5],[487,123,487,119],[487,67],[487,36,472,16.5],[457,-3,428,-3],[400,-3,385,17.5],[370,38,370,67],[370,119],[370,125,364,125],[124,125],[39,125,39,193],[39,214,52,238],[341,690],[353,709,362,720],[371,731,386.5,741.5],[402,752,420,752],[487,752,487,667],[487,243],[487,237,493,237],[500,237],[561,230,561,181]]],
        sC                         : ['J#D, J#CwI¢C] IZCBI5C= H³C8H³C0 H³BH H³A­HsAd HTA<G½A< GcA<GDAf G%A±G%BH G%C0 G%C<F½C< C:C< A³C<A³DD A³DoB*DÁ FmL% F§LLF¹Lc G(LyGGL° GgM!G­M! H³M!H³Ky H³E( H³D¿H¿D¿ I*D¿ J#D±J#D,'],
        // holeCmds                   : [[[[184,237],[364,237],[370,237,370,244],[370,539],[369,542],[368,542,366,540],[182,243],[181,242,181,240],[181,237,184,237]]]],
        hC                         : [['D2D¿ F½D¿ G%D¿G%E* G%Iy G#I¡ G!I¡FÁI{ D.E( D,E%D,E! D,D¿D2D¿']],
        xMin                       : 39,
        xMax                       : 561,
        yMin                       : -3,
        yMax                       : 752,
        width                      : 600
      };
      hpb["5"]                     = {
        sC                         : ['E©A2 DsA2CvA¢ ByBLB:CN B(CwB(C­ B(D4BLDX BqD}BÁD} CeD}C­D, D,CiDpC@ E2B»E©B» F¡B»GPCl H!D>H!E6 H!F,GOF¡ F}GPE©GP E@GPDlG/ C¹F±CwF± C@F±B¶G7 BgGaBgG» BgH,BiH8 CNL# CTLPC¢Lw D*L¿D_LÁ GÃLÁ H>LÁHjLz H·LTH·L, H·K©HqK` HLK8GÃK8 D¿K8 D­K8D©K* DyJRDlI´ D_IPDYI: DTI#DTHÃ DXI!DtI( D±I.E:I4 EgI:E©I: G]I:HtH" I­F¯I­E6 I­CaHtBI G]A2E©A2'],
        xMin                       : 51,
        xMax                       : 548,
        yMin                       : -8,
        yMax                       : 750,
        width                      : 600
      };
      hpb["6"]                     = {
        // shapeCmds                  : [[[308,509],[414,504,487.5,433.5],[561,363,561,253],[561,144,485,68],[409,-8,301,-8],[190,-8,114,67.5],[38,143,38,253],[38,329,73,384],[288,722],[309,754,341,754],[366,754,382.5,737],[399,720,399,695],[399,676,388,660],[304,532],[295,520,289,508],[294,509,308,509]]],
        sC                         : ['F*I< G¡I2H´H$ J#F»J#E< J#CcH¯BJ GuA2E¿A2 D>A2C%BI A±CaA±E< A±FTBTGB E¥Lg F,M%FmM% FÁM%G?L§ GaLcGaL0 GaK­GJKk F!Ik E³IRE§I: E±I<F*I<'],
        // holeCmds                   : [[[[300,398],[238,398,196.5,356.5],[155,315,155,253],[155,191,196.5,149.5],[238,108,300,108],[362,108,403,149.5],[444,191,444,253],[444,314,402.5,356],[361,398,300,398]]]],
        hC                         : [['E½G_ DÁG_DKF® CyF8CyE< CyD@DKCn DÁB½E½B½ F¹B½GiCn H:D@H:E< H:F6GhF­ F·G_E½G_']],
        xMin                       : 38,
        xMax                       : 561,
        yMin                       : -8,
        yMax                       : 754,
        width                      : 600
      };
      hpb["7"]                     = {
        // shapeCmds                  : [[[193,-4],[170,-4,152,13.5],[134,31,134,54],[134,67,136,70],[381,628],[382,632,382,633],[382,636,378,636],[141,636],[119,636,103,653],[87,670,87,693],[87,716,103,733],[119,750,141,750],[421,750],[463,750,487,724],[511,698,511,660],[511,651,506,631],[245,31],[230,-4,193,-4]]],
        sC                         : ['DDA: C¹A:CsA^ CNA£CNB. CNBHCRBN G<K* G>K2G>K4 G>K:G6K: C]K: C0K:B³K] BqK¡BqL, BqLZB³L} C0LÁC]LÁ G¯LÁ HaLÁH³Lk I@L6I@Kk I@KXI6K0 E,A£ D±A:DDA:'],
        xMin                       : 87,
        xMax                       : 511,
        yMin                       : -4,
        yMax                       : 750,
        width                      : 600
      };
      hpb["8"]                     = {
        sC                         : ["E½A2 DPA2CDB? B8CLB8Dµ B8EkBdFE B±FÃCVG] C­G« B§H±B§I» B§K>C|L5 DsM,E½M, G>M,H7L5 I0K>I0IÁ I0I*HTH< H(G« HÃF¿INFB I{EmI{Dµ I{CNHnB@ GaA2E½A2"],
        hC                         : [["GJFC F¥F¯E½F¯ E2F¯DiFC CÁE{CÁDµ CÁD*DiCa E2B¹E½B¹ F¡B¹GHCa GµD*GµDµ GµE{GJFC","F¹Jµ FcKFE½KF ERKFDÀJ´ DiJ]DiI¹ DiILD¿Hº EPHcE½Hc FcHcF¹H» GJINGJI¹ GJJ_F¹Jµ"]],
        xMin                       : 59,
        xMax                       : 540,
        yMin                       : -8,
        yMax                       : 757,
        width                      : 600
      };
      hpb["9"]                     = {
        sC                         : ["E«D¿ D4E%BÄF3 A±G@A±H¿ A±JwC%K± D>M%E¹M% GuM%H¯K² J#JyJ#H¿ J#G§I_F¹ F0As E©A2EFA2 D·A2DtAT DRAwDRB( DRBNDiBo E³Do E¹DwE¾D¡ EÃD©F$D² F*D»F.DÁ F#D¿E«D¿"],
        hC                         : [["E»F{ F·F{GhGM H:GÃH:H¿ H:I»GhJl F·K>E»K> D¿K>DJJl CyI»CyH¿ CyH!DKGN DÁF{E»F{"]],
        xMin                       : 38,
        xMax                       : 561,
        yMin                       : -8,
        yMax                       : 754,
        width                      : 600
      };
      hpb["%"]                     = {
        shapeCmds                  : [
                                       [[278,4],[271,-3,264,-3],[251,-3,243,5],[235,13,235,26],[235,36,239,43],[604,735],[608,743,617,743],[618,743,620,742],[627,749,637,749],[648,749,655,741.5],[662,734,662,723],[662,712,657,705],[641,676],[294,17],[288,4,278,4]],
                                       [[548,53],[495,106,495,180],[495,254,548,307],[601,360,675,360],[749,360,802,307],[855,254,855,180],[855,106,802,53],[749,0,675,0],[601,0,548,53]],
                                       [[101,443],[48,496,48,570],[48,644,101,697],[154,750,228,750],[302,750,355,697],[408,644,408,570],[408,496,355,443],[302,390,228,390],[154,390,101,443]]
                                     ],  

        holeCmds                   : [
                                      [],
                                      [[[607.5,247.5],[580,220,580,180],[580,140,607.5,112.5],[635,85,675,85],[715,85,742.5,112.5],[770,140,770,180],[770,220,742.5,247.5],[715,275,675,275],[635,275,607.5,247.5]]],
                                      [[[160.5,637.5],[133,610,133,570],[133,530,160.5,502.5],[188,475,228,475],[268,475,295.5,502.5],[323,530,323,570],[323,610,295.5,637.5],[268,665,228,665],[188,665,160.5,637.5]]]
                                    ],
        xMin                       : 48,
        xMax                       : 855,
        yMin                       : -3,
        yMax                       : 750,
        width                      : 892
      };
      hpb["#"]                     = {
        sC                         : ['BwEu DHEu DsH% C2H% BTH%BTHi BTH©BgH¼ ByI,B»I, D©I, E#J¡E4K¡ E@L:ENLN E]LcE¥Lc EÁLcF0LS FBLDFBL* FBK·E±I, G»I, H6J¡HFK¡ HPL6H`LL HoLcHµLc I*LcI>LR IRLBIRL, IRL*IQKÃ IPK¹IPKµ HÃI, JaI, K<I,K<Hi K<H%J{H% H¯H% HaEu IÃEu J¡EuJ¡E0 J¡DoIÁDo HLDo HFD0H5C< H#BHGÁA¿ G¹AcGªAM GyA8GRA8 G4A8G"AI FµAZFµAq F·A¥ G#C%GFDo E:Do D¿B¿D¯A¿ D£AaDtAL DgA8D@A8 D#A8CµAH C£AXC£Aq C§A¯C§A» D2Do BuDo A¹DoA¹E0 A¹EuBwEu'],
        hC                         : [["G§H% E{H% EPEu GZEu G§H%"]],
        xMin                       : 42,
        xMax                       : 637,
        yMin                       : -5,
        yMax                       : 720,
        width                      : 673
      };
      hpb["$"]                     = {
        sC                         : ["EB?¯ D]?¯D]@« D]A< CXARB£AÁ B(BkAÃCV AÃC§B@D( BaDLB±DL CTDLC¡C{ D0B»E6B» E«B»FACS F{C±F{D_ F{D¹FeEB FNEoF#E® E{F(ETF9 E.FJDwF] AÁGLAÁI³ AÁK#BxK³ CPL}D]LÁ D]MV D]NTEBNT EqNTE¯N7 F(M½F(Mm F(LÁ F¥L«GLLM G¹KµH4K@ H:JÃH:J· H:JmG¸JR GqJ8G>J8 FwJ8F_Je F*KBE>KB DwKBDAJ® C¯JTC¯I¯ C¯IgCÀID D.I!D@H± DRH{D¢Ha E,HFE>H> EPH6E©GÁ G<GNG±Fj HaE§HaD_ HaCLGªBY G.AgF(AB F(@s F(@FE¯@) Eq?¯EB?¯"],
        xMin                       : 46,
        xMax                       : 463,
        yMin                       : -91,
        yMax                       : 841,
        width                      : 499
      };
      hpb["&"]                     = {
        xMin                       : 46,
        xMax                       : 463,
        yMin                       : -91,
        yMax                       : 841,
        width                      : 499
      };
      hpb["&"]                     = {
        xMin                       : 200,
        xMax                       : 200,
        yMin                       : 200,
        yMax                       : 200,
        width                      : 290
      };
      hpb["?"]                     = {
        xMin                       : 200,
        xMax                       : 200,
        yMin                       : 200,
        yMax                       : 200,
        width                      : 290
      };
      hpb["!"]                     = {
        xMin                       : 200,
        xMax                       : 200,
        yMin                       : 200,
        yMax                       : 200,
        width                      : 290
      };
      hpb["|"]                     = {
        xMin                       : 200,
        xMax                       : 200,
        yMin                       : 200,
        yMax                       : 200,
        width                      : 290
      };
      hpb["("]                     = {
        // shapeCmds                 : [[[51,541],[51,701,170,793],[185,805,205,805],[228,805,243.5,789.5],[259,774,259,751],[259,729,244,714],[196,667,181.5,623],[167,579,167,505],[167,198],[167,123,181.5,80],[196,37,244,-10],[259,-25,259,-48],[259,-70,243.5,-86],[228,-102,205,-102],[187,-102,170,-90],[51,4,51,162]]],
        sC                         : ['B(I} B(L<C¹Mu D4M¯D]M¯ D­M¯E)Mn EHMNEHLÃ EHLuE*LV DJKyD-JÃ C³JHC³I4 C³DN C³C8D-Bc DJA¯E*A. EH@³EH@c EH@6E)?¹ D­?wD]?w D8?wC¹?± B(AJB(C©'],
        xMin                       : 51,
        xMax                       : 259,
        yMin                       : -102,
        yMax                       : 805,
        width                      : 297
      };
      hpb[")"]                     = {
        // shapeCmds                 : [[[257,162],[257,2,139,-90],[124,-102,104,-102],[81,-102,65.5,-86.5],[50,-71,50,-48],[50,-24,64,-10],[112,38,126.5,80.5],[141,123,141,198],[141,505],[141,580,126.5,623.5],[112,667,64,714],[50,728,50,751],[50,774,65.5,789.5],[81,805,104,805],[122,805,139,793],[257,701,257,541]]],
        sC                         : ['EDC© EDAFCX?± C:?wBµ?w Be?wBE?¸ B%@4B%@c B%@µBBA. C!A±C?Bd C]C8C]DN C]I4 C]JJC?JÄ C!KyBBLV B%LsB%LÃ B%MNBEMn BeM¯BµM¯ C6M¯CXMu EDL<EDI}'],
        xMin                       : 50,
        xMax                       : 257,
        yMin                       : -102,
        yMax                       : 805,
        width                      : 295
      };
      hpb["-"]                     = {
        shapeCmds                  : [[[106,332],[308,332],[374,332,374,287],[374,242,308,242],[123,242],[57,242,57,287],[57,308,70,320],[83,332,106,332]]],
        xMin                       : 57,
        xMax                       : 374,
        yMin                       : 242,
        yMax                       : 332,
        width                      : 412
      };
      hpb["_"]                     = {
        shapeCmds                  : [[[57,-127],[57,-64],[613,-64],[613,-127],[57,-127]]],
        xMin                       : 57,
        xMax                       : 613,
        yMin                       : -127,
        yMax                       : -64,
        width                      : 651
      };
      hpb["="]                     = {
        fullPath                   : "M 107 306 L 107 306 L 465 306 Q 514 306 514 261 L 514 261 Q 514 255 513 253 L 513 253 Q 514 250 514 245 L 514 245 Q 514 200 465 200 L 465 200 L 107 200 Q 58 200 58 245 L 58 245 L 58 253 L 58 261 Q 58 306 107 306 Z",
        shapeCmdsOrig              : [[[107,306],[465,306],[514,306,514,261],[514,255,513,253],[514,250,514,245],[514,200,465,200],[107,200],[58,200,58,245],[58,253],[58,261],[58,306,107,306]]],
        shapeCmds                  : [
                                      [[107,306-60 ],[465,306-60 ],[514,306-60 ,514,261-60 ],[514,255-60 ,513,253-60 ],[514,250-60 ,514,245-60 ],[514,200-60 ,465,200-60 ],[107,200-60 ],[58,200-60 ,58,245-60 ],[58,253-60 ],[58,261-60 ],[58,306-60 ,107,306-60 ]],
                                      [[107,306+130],[465,306+130],[514,306+130,514,261+130],[514,255+130,513,253+130],[514,250+130,514,245+130],[514,200+130,465,200+130],[107,200+130],[58,200+130,58,245+130],[58,253+130],[58,261+130],[58,306+130,107,306+130]]
                                     ],
        xMin                       : 58,
        xMax                       : 514,
        yMin                       : 200,
        yMax                       : 306,
        width                      : 553
      };
      hpb["+"]                     = {
        sC                         : ["B¯E¹ E(E¹ E(H0 E(H{E=H¹ ERI2E£I2 F.I2FCH¸ FXHyFXH0 FXE¹ HqE¹ IuE¹IuE> IuDgHqDg FXDg FXBN FXA§FCAh F.AJE£AJ ERAJE=Ah E(A§E(BN E(Dg B±Dg A¯DgA¯E> A¯EsB-E§ BNE¹B¯E¹"],
        xMin                       : 37,
        xMax                       : 537,
        yMin                       : 4,
        yMax                       : 504,
        width                      : 572
      };
      hpb[","]                     = {
        // fullPath                   : "M 43 65 Q 43 88 57 103 Q 71 118 91 118 Q 115 118 128.5 101 Q 142 84 142 59 L 142 -51 Q 142 -61 133 -69 Q 124 -77 114 -77 Q 96 -77 74.5 -30.5 Q 53 16 43 65 Z",
        // shapeCmds                  : [[[43,65],[43,88,57,103],[71,118,91,118],[115,118,128.5,101],[142,84,142,59],[142,-51],[142,-61,133,-69],[124,-77,114,-77],[96,-77,74.5,-30.5],[53,16,43,65]]],
        sC                         : ['A»BD A»BsB4B³ BPC.ByC. C(C.CCB¯ C_BkC_B8 C_@] C_@HCL@8 C:@(C%@( B¥@(BW@¨ B,AcA»BD'],
        xMin                       : 43,
        xMax                       : 142,
        yMin                       : -77,
        yMax                       : 118,
        width                      : 180
      };
      hpb["."]                     = {
        // shapeCmds                  : [[[66,10.5],[51,25,51,45],[51,65,66.5,80.5],[82,96,103,96],[122,96,137,80.5],[152,65,152,45],[152,25,137.5,10.5],[123,-4,103,-4],[81,-4,66,10.5]]],
        sC                         : ['BFAW B(AuB(A¿ B(BDBGBd BgB¥B³B¥ C6B¥CTBd CsBDCsA¿ CsAuCUAW C8A:B³A: BeA:BFAW'],
        xMin                       : 51,
        xMax                       : 152,
        yMin                       : -4,
        yMax                       : 96,
        width                      : 190
      };
      hpb[nbsp]                    = {
        xMin                       : 200,
        xMax                       : 200,
        yMin                       : 200,
        yMax                       : 200,
        width                      : 290
      };
      hpb[" "]                     = hpb[nbsp];

      return hpb;
  };
  /*
// https://opentype.js.org/glyph-inspector.html
function coordinates(cmd){
  if(cmd.x1){
    return " "+cmd.x1+" "+(0-cmd.y1)+" "+cmd.x+" "+(0-cmd.y)
  }else{
    if(cmd.x){
      return " "+cmd.x+" "+(0-cmd.y)
    }else{
      return ""
    }
  }
};
function makeD(path){
  var d  = "";
  path.commands.forEach(function(cmd){d+=" "+cmd.type+coordinates(cmd)});
  return d.slice(1)
}
*/

  //  HELVETICANEUE-MEDIUM  HELVETICANEUE-MEDIUM  HELVETICANEUE-MEDIUM  HELVETICANEUE-MEDIUM 
  //
  //
  HNM                            = function(codeList){

      var hnm={reverseHoles:false,reverseShapes:true},nbsp="\u00A0";
      hnm["A"]                     = {
        shapeCmds                  : [[[122,0],[-7,0],[267,714],[400,714],[675,0],[541,0],[474,189],[189,189],[122,0]]],
        holeCmds                   : [[[[334,591],[331,591],[223,284],[441,284]]]],
        xMin                       : -7,
        xMax                       : 675,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 667
      };
      hnm["B"]                     = {
        shapeCmds                  : [[[404,0],[76,0],[76,714],[423,714],[522,714,578.5,669],[635,624,635,537],[635,429,533,385],[533,383],[667,354,667,199],[667,110,605,58],[536,0,404,0]]],
        holeCmds                   : [[[[422,325],[201,325],[201,102],[422,102],[542,102,542,215],[542,325,422,325]],[[405,612],[201,612],[201,415],[405,415],[451,415,480.5,441],[510,467,510,514],[510,612,405,612] ]  ]],
        xMin                       : 76,
        xMax                       : 667,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 704
      };
      hnm["C"]                     = {
        // shapeCmds                  : [[[558,487],[522,629,380,629],[273,629,214,544],[163,470,163,357],[163,244,214,170],[273,85,380,85],[460,85,509,140],[554,190,562,272],[684,272],[676,143,592.5,63],[509,-17,380,-17],[224,-17,129,94],[38,199,38,357],[38,516,129,621],[224,731,380,731],[503,731,586,667],[672,600,683,487]]],
        sC                         : ['IÁH³ IVK,G:K, EeK,DoI¥ C«HoC«F¯ C«E*DoC¹ EeBmG:Bm HZBmI<CZ I¹D>J%Ec K½Ec K­CaJdB@ I<@ÃG:@Ã D¥@ÃCDB¡ A±DPA±F¯ A±IJCDJ¿ D¥LyG:Ly I0LyJVKy K¥JsK»H³'],
        xMin                       : 38,
        xMax                       : 684,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 722
      };
      hnm["D"]                     = {
        shapeCmds                  : [[[372,0],[76,0],[76,714],[372,714],[529,714,612,609],[687,515,687,357],[687,199,612,105],[529,0,372,0]]],
        holeCmds                   : [[[[324,612],[201,612],[201,102],[324,102],[460,102,517,176],[562,236,562,357],[562,478,517,538],[460,612,324,612]]]],
        xMin                       : 76,
        xMax                       : 687,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      hnm["E"]                     = {
        shapeCmds                  : [[[597,0],[76,0],[76,714],[590,714],[590,606],[201,606],[201,419],[561,419],[561,317],[201,317],[201,108],[597,108],[597,0]]],
        xMin                       : 76,
        xMax                       : 597,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 630
      };
      hnm["F"]                     = {
        shapeCmds                  : [[[201,0],[76,0],[76,714],[569,714],[569,606],[201,606],[201,419],[524,419],[524,317],[201,317],[201,0]]],
        xMin                       : 76,
        xMax                       : 569,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 593
      };
      hnm["G"]                     = {
        // shapeCmds                  : [[[699,376],[699,0],[619,0],[600,84],[551,28,501.5,5.5],[452,-17,385,-17],[229,-17,134,94],[43,199,43,357],[43,515,134,621],[229,731,385,731],[507,731,589,669],[677,604,691,487],[569,487],[560,555,506,593],[456,629,385,629],[278,629,219,544],[168,470,168,357],[168,244,219,170],[277,86,385,85],[480,84,531.5,136.5],[583,189,585,281],[395,281],[395,376]]],
        sC                         : ['L8G2 L8AB J»AB JsBk I³A{I-AM HJ@ÃGD@Ã D¯@ÃCNB¡ A»DPA»F¯ A»IHCNJ¿ D¯LyGDLy I8LyJ]K} K¯J{L(H³ J4H³ J!I»I6Je HRK,GDK, EoK,DyI¥ CµHoCµF¯ CµE*DyC¹ EmBoGDBm H¥BkIjCS JPD<JTEu GXEu GXG2'],
        xMin                       : 43,
        xMax                       : 699,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 759
      };
      hnm["H"]                     = {
        shapeCmds                  : [[[198,0],[73,0],[73,714],[198,714],[198,430],[523,430],[523,714],[648,714],[648,0],[523,0],[523,322],[198,322],[198,0]]],
        xMin                       : 73,
        xMax                       : 648,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      hnm["I"]                     = {
        shapeCmds                  : [[[201,0],[76,0],[76,714],[201,714],[201,0]]],
        xMin                       : 76,
        xMax                       : 201,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 278
      };
      hnm["J"]                     = {
        shapeCmds                  : [[[336,714],[461,714],[461,230],[461,117,420,60],[365,-17,226,-17],[118,-17,63,49],[13,108,13,212],[13,250],[138,250],[138,213],[138,149,159,119],[182,85,236,85],[294,85,316,121],[336,151,336,223],[336,714]]],
        xMin                       : 13,
        xMax                       : 461,
        yMin                       : -17,
        yMax                       : 714,
        width                      : 537
      };
      hnm["K"]                     = {
        shapeCmds                  : [[[201,0],[76,0],[76,714],[201,714],[201,389],[519,714],[673,714],[388,429],[693,0],[537,0],[303,341],[201,240],[201,0]]],
        xMin                       : 76,
        xMax                       : 693,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 685
      };
      hnm["L"]                     = {
        shapeCmds                  : [[[564,0],[76,0],[76,714],[201,714],[201,108],[564,108],[564,0]]],
        xMin                       : 76,
        xMax                       : 564,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      hnm["M"]                     = {
        shapeCmds                  : [[[193,0],[74,0],[74,714],[250,714],[447,155],[449,155],[641,714],[815,714],[815,0],[696,0],[696,551],[694,551],[496,0],[393,0],[195,551],[193,551],[193,0]]],
        xMin                       : 48,
        xMax                       : 815,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 889
      };
      hnm["N"]                     = {
        shapeCmds                  : [[[190,0],[71,0],[71,714],[203,714],[529,188],[531,188],[531,714],[650,714],[650,0],[518,0],[193,525],[190,525],[190,0]]],
        xMin                       : 71,
        xMax                       : 650,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      hnm["O"]                     = {
        shapeCmds                  : [[[380,731],[536,731,631,621],[722,515,722,357],[722,199,631,94],[536,-17,380,-17],[224,-17,129,94],[38,199,38,357],[38,515,129,621],[224,731,380,731]]],
        holeCmds                   : [[[[380,629],[273,629,214,544],[163,470,163,357],[163,244,214,170],[273,85,380,85],[487,85,546,170],[597,244,597,357],[597,470,546,544],[487,629,380,629]]]],
        xMin                       : 38,
        xMax                       : 722,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 760
      };
      hnm["P"]                     = {
        shapeCmds                  : [[[201,0],[76,0],[76,714],[391,714],[527,714,589,637],[634,581,634,493],[634,406,589,351],[527,274,391,274],[201,274],[201,0]]],
        holeCmds                   : [[[[386,612],[201,612],[201,376],[384,376],[434,376,468,401],[509,432,509,494],[509,612,386,612]]]],
        xMin                       : 76,
        xMax                       : 634,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 667
      };
      hnm["Q"]                     = {
        shapeCmds                  : [[[621,83],[713,3],[652,-65],[548,26],[472,-17,380,-17],[224,-17,129,94],[38,199,38,357],[38,515,129,621],[224,731,380,731],[536,731,631,621],[722,515,722,357],[722,180,621,83]]],
        holeCmds                   : [[[[460,102],[388,165],[448,234],[535,158],[597,232,597,357],[597,470,546,544],[487,629,380,629],[273,629,214,544],[163,470,163,357],[163,244,214,170],[273,85,380,85],[425,85,460,102]]]],
        xMin                       : 38,
        xMax                       : 722,
        yMin                       : -65,
        yMax                       : 731,
        width                      : 760
      };
      hnm["R"]                     = {
        shapeCmds                  : [[[201,0],[76,0],[76,714],[417,714],[533,714,593,663.5],[653,613,653,521],[653,382,535,341],[535,339],[641,324,641,188],[641,42,680,0],[546,0],[527,31,527,105],[527,208,499,249],[468,294,385,294],[201,294],[201,0]]],
        holeCmds                   : [[[[404,612],[201,612],[201,389],[406,389],[528,389,528,503],[528,612,404,612]]]],
        xMin                       : 76,
        xMax                       : 680,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 704
      };
      hnm["S"]                     = {
        // shapeCmds                  : [[[158,238],[158,160,211,120],[258,85,339,85],[416,85,456,119],[456,119],[490,148,490,193],[490,259,431,281],[423,284,218,340],[60,383,60,521],[60,521],[60,622,142,680],[215,731,321,731],[438,731,514,673],[595,610,595,503],[470,503],[462,629,316,629],[264,629,229,610],[185,585,185,536],[185,467,270,444.5],[355,422,476,389],[543,369,581,315],[615,266,615,207],[615,95,526,35],[449,-17,331,-17],[201,-17,122,44],[35,111,33,238]]],
        sC                         : ['C¡DÁ C¡C¥DiC2 EFBmFiBm G¥BmHRC0 HRC0 H¹CkH¹DD H¹EHGÃEu G³E{DwFk B:G@B:IT B:IT B:JÁC_Kµ DqLyFDLy H.LyIFK§ JiJ©JiI0 HoI0 H_K,F:K, ERK,D¯J© D4JTD4Is D4HiE_H; F«G±H{GL I£G#JLF8 J³EVJ³Da J³B£I_A« HD@ÃFX@Ã DT@ÃC6A½ A«BÃA§DÁ'],
        xMin                       : 33,
        xMax                       : 615,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 648
      };
      hnm["T"]                     = {
        shapeCmds                  : [[[234,606],[8,606],[8,714],[586,714],[586,606],[359,606],[359,0],[234,0],[234,606]]],
        xMin                       : 8,
        xMax                       : 586,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 593
      };
      hnm["U"]                     = {
        shapeCmds                  : [[[68,257],[68,714],[193,714],[193,298],[193,201,216,159],[253,91,361,91],[469,91,506,159],[529,201,529,298],[529,714],[654,714],[654,257],[654,123,574,51],[497,-17,361,-17],[225,-17,149,51],[68,123,68,257]]],
        xMin                       : 68,
        xMax                       : 654,
        yMin                       : -17,
        yMax                       : 714,
        width                      : 722
      };
      hnm["V"]                     = {
        shapeCmds                  : [[[372,0],[233,0],[-5,714],[125,714],[304,149],[306,149],[489,714],[616,714],[372,0]]],
        xMin                       : -5,
        xMax                       : 616,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 611
      };
      hnm["W"]                     = {
        shapeCmds                  : [[[323,0],[194,0],[6,714],[133,714],[262,168],[264,168],[408,714],[536,714],[676,168],[678,168],[811,714],[938,714],[741,0],[614,0],[471,546],[469,546],[323,0]]],
        xMin                       : 6,
        xMax                       : 938,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 944
      };
      hnm["X"]                     = {
        shapeCmds                  : [[[-3,0],[250,370],[14,714],[163,714],[325,462],[494,714],[634,714],[398,370],[651,0],[499,0],[321,273],[140,0],[-3,0]]],
        xMin                       : -3,
        xMax                       : 651,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 648
      };
      hnm["Y"]                     = {
        shapeCmds                  : [[[387,0],[262,0],[262,280],[-6,714],[139,714],[328,394],[514,714],[654,714],[387,280],[387,0]]],
        xMin                       : -6,
        xMax                       : 654,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 648
      };
      hnm["Z"]                     = {
        shapeCmds                  : [[[439,606],[55,606],[55,714],[598,714],[598,619],[182,108],[608,108],[608,0],[23,0],[23,102],[439,606]]],
        xMin                       : 23,
        xMax                       : 608,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 630
      };
      hnm["a"]                     = {
        // shapeCmds                  : [[[493,115],[493,76,520,76],[536,76,548,78],[548,-1],[511,-14,476,-14],[400,-14,388,49],[324,-14,209,-14],[134,-14,86,24],[32,65,32,137],[32,223,96,261],[135,284,231,298],[339,314,339,314],[386,328,386,371],[386,441,279,441],[172,441,165,359],[51,359],[61,531,286,531],[371,531,427,497],[493,457,493,381]]],
        sC                         : ['H¿C( H¿BZIRBZ IsBZI­B_ I­A@ I@A%H{A% GcA%GJB# FJA%DeA% CNA%BoAs A¥BDA¥CT A¥D£B¥EL CPE{D³E¹ FiF6FiF6 GFFRGFG( GFH4EqH4 C½H4C¯F³ B(F³ B<IiE¡Ii G(IiG»I# H¿HTH¿G<'],
        // holeCmds                   : [[[[379,259],[357,245,315,238],[277,233,239,228],[146,212,146,142],[146,108,184,90],[213,76,251,76],[297,76,334,98],[379,125,379,174]]]],
        hC                         : [['G8EH F¯E,F8DÁ EmD·DÃD­ CgDkCgC_ CgB½D2Bw DmBZE8BZ E·BZF_B© G8C<G8CÁ']],
        xMin                       : 32,
        xMax                       : 548,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 556
      };
      hnm["á"]                     = {
        sC                         : [acuteCoded(158,0),hnm.a.sC[0]],
        hC                         : [[],hnm.a.hC[0]],
        xMin                       : 32,
        xMax                       : 548,
        yMin                       : -14,
        yMax                       : 731,
        width                      : 556
      };
      hnm["b"]                     = {
        shapeCmds                  : [[[171,0],[63,0],[63,714],[177,714],[177,450],[179,450],[202,487,245,509],[288,531,333,531],[450,531,515,450],[575,376,575,256],[575,143,521,69],[460,-14,352,-14],[216,-14,173,71],[171,71],[171,0]]],
        holeCmds                   : [[[[461,258],[461,333,425,385],[385,441,318,441],[248,441,210.5,392],[173,343,173,258],[173,178,212,127],[251,76,318,76],[390,76,429,133],[461,182,461,258]]]],
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 611
      };
      hnm["c"]                     = {
        // shapeCmds                  : [[[409,344],[395,441,291,441],[234,441,198,406],[149,358,149,253],[149,180,180,132],[217,76,286,76],[336,76,368.5,107.5],[401,139,409,194],[523,194],[490,-14,286,-14],[168,-14,100,63],[35,135,35,253],[35,376,99,451],[167,531,290,531],[385,531,447,485],[515,435,523,344]]],
        sC                         : ['GuFs GXH4E«H4 D¹H4DNGo CmF±CmE< CmD*D*CJ DuBZE¡BZ FcBZG"B¼ GeCXGuDF IXDF H¹A%E¡A% CµA%B­B@ A«CPA«E< A«G2B«HH C³IiE©Ii GDIiH@H¯ IHH(IXFs'],
        xMin                       : 35,
        xMax                       : 523,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 556
      };
      hnm["d"]                     = {
        shapeCmds                  : [[[433,714],[547,714],[547,0],[439,0],[439,70],[437,70],[394,-14,277,-14],[159,-14,95,66],[35,140,35,262],[35,394,105,467],[166,531,259,531],[381,531,431,450],[433,450],[433,714]]],
        holeCmds                   : [[[[149,253],[149,180,183,131],[222,76,292,76],[363,76,403,134],[437,184,437,259],[437,344,398.5,392.5],[360,441,294,441],[220,441,181,382],[149,332,149,253]]]],
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 611
      };
      hnm["e"]                     = {
        shapeCmds                  : [[[149,229],[149,164,183,122],[183,122],[220,76,288,76],[288,76],[384,76,414,162],[414,162],[522,162],[504,79,439.5,32.5],[375,-14,288,-14],[288,-14],[169,-14,102,61],[35,136,35,258],[35,372,102,450],[173,531,285,531],[394,531,464,451],[531,376,531,267],[531,248,529,229]]],
        sC                         : ['CmD¯ CmC­D0C6 D0C6 D{BZE¥BZ E¥BZ GBBZG¡C© G¡C© IVC© I2BaH1A¦ G0A%E¥A% E¥A% C·A%B±B< A«CRA«EF A«G*B±HF C¿IiE}Ii GVIiHcHH IiG2IiEX IiE2IeD¯'],
        holeCmds                   : [[[[415,304],[412,361,376.5,401],[341,441,285,441],[227,441,189,402],[151,363,149,304]]]],
        hC                         : [['G£F! G{F·G3Ge FmH4E}H4 D«H4D<Gg CqF»CmF!']],
        xMin                       : 35,
        xMax                       : 531,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 556
      };
      hnm["é"]                     = {
        shapeCmds                  : [acuteRaw(158,0),hnm.e.shapeCmds[0]],
        holeCmds                   : [[],hnm.e.holeCmds[0]],
        xMin                       : 35,
        xMax                       : 531,
        yMin                       : -14,
        yMax                       : 731,
        width                      : 556
      };
      hnm["f"]                     = {
        shapeCmds                  : [[[9,432],[9,517],[94,517],[94,560],[94,650,138,687],[171,714,237,714],[292,714,317,707],[317,618],[295,624,264,624],[208,624,208,570],[208,517],[305,517],[305,432],[208,432],[208,0],[94,0],[94,432]]],
        xMin                       : 9,
        xMax                       : 317,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 315
      };
      hnm["g"]                     = {
        // shapeCmds                  : [[[538,517],[538,27],[538,-205,284,-205],[194,-205,133,-170],[60,-128,53,-44],[167,-44],[183,-120,291,-120],[424,-120,424,12],[424,91],[422,91],[371,0,267,0],[150,0,90,81],[35,152,35,272],[35,381,97,454],[162,531,269,531],[380,531,422,446],[424,446],[424,517]]],
        sC                         : ['IwIL IwAy Iw>(E{>( DF>(CL>o B:?BB,@k C³@k D0?RE«?R Gµ?RGµAZ GµBy G±By G(ABEXAB CoABBwBe A«CsA«Ec A«G<B§HN C©IiE]Ii G:IiG±H> GµH> GµIL'],
        // holeCmds                   : [[[[285,90],[355,90,392,147],[424,196,424,270],[424,343,392,389],[355,441,285,441],[215,441,179,383],[149,335,149,261],[149,191,181,144],[218,90,285,90]]]],
        hC                         : [['E}Bw F«BwGRCi GµDJGµE_ GµFqGRGL F«H4E}H4 DqH4D(G@ CmFaCmEL CmD@D,Cc DwBwE}Bw']],
        xMin                       : 35,
        xMax                       : 538,
        yMin                       : -205,
        yMax                       : 531,
        width                      : 593
      };
      hnm["h"]                     = {
        shapeCmds                  : [[[174,0],[60,0],[60,714],[174,714],[174,449],[176,449],[198,485,239.5,508],[281,531,331,531],[417,531,465.5,486],[514,441,514,355],[514,0],[400,0],[400,325],[400,441,299,441],[243,441,208.5,402],[174,363,174,305],[174,0]]],
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      hnm["i"]                     = {
        shapeCmds                  : [[[177,0],[63,0],[63,517],[177,517]],[[177,606],[63,606],[63,714],[177,714]]],
        xMin                       : 48,
        xMax                       : 159,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      hnm["í"]                     = {
        shapeCmds                  : [acuteRaw(0,0),dotlessiRaw()],
        xMin                       : 45,
        xMax                       : 270,
        yMin                       : 0,
        yMax                       : 731,
        width                      : 241
      };
      hnm["j"]                     = {
        shapeCmds                  : [[[63,-39],[63,517],[177,517],[177,-44],[177,-205,29,-205],[8,-205,-22,-201],[-22,-111],[8,-115,17,-115],[46,-115,56,-96],[63,-81,63,-39]],[[177,606],[63,606],[63,714],[177,714],[177,606]]],
        xMin                       : -22,
        xMax                       : 177,
        yMin                       : -205,
        yMax                       : 714,
        width                      : 241
      };
      hnm["k"]                     = {
        shapeCmds                  : [[[177,0],[63,0],[63,714],[177,714],[177,308],[383,517],[523,517],[325,327],[542,0],[403,0],[245,251],[177,185],[177,0]]],
        xMin                       : 63,
        xMax                       : 542,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 537
      };
      hnm["l"]                     = {
        shapeCmds                  : [[[177,0],[63,0],[63,714],[177,714],[177,0]]],
        xMin                       : 63,
        xMax                       : 177,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      hnm["m"]                     = {
        shapeCmds                  : [[[60,0],[60,517],[168,517],[168,445],[171,445],[228,531,330,531],[330,531],[441,531,475,445],[537,531,637,531],[810,531,810,357],[810,0],[696,0],[696,302],[696,375,682,402],[663,441,602,441],[492,441,492,303],[492,0],[378,0],[378,332],[378,388,357.5,414.5],[337,441,287,441],[240,441,207,405],[174,369,174,307],[174,0]]],
        sC                         : ['B:AB B:IL CµIL CµH< C»H< D­IiFVIi FVIi H4IiHyH< IuIiK<Ii M¹IiM¹F¯ M¹AB L2AB L2EÁ L2G0K¹Gg KqH4JwH4 H½H4H½EÃ H½AB G6AB G6FZ G6GJF°G¢ FeH4E£H4 E!H4DaGm CÁG#CÁF( CÁAB'],
        xMin                       : 60,
        xMax                       : 810,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 870
      };
      hnm["n"]                     = {
        shapeCmds                  : [[[174,0],[60,0],[60,517],[168,517],[168,441],[170,439],[225,531,331,531],[417,531,465.5,486],[514,441,514,355],[514,0],[400,0],[400,325],[400,441,299,441],[243,441,208.5,402],[174,363,174,305],[174,0]]],
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 574
      };
      hnm["ñ"]                     = {
        shapeCmds                  : [tildeRaw(167,0),hnm.n.shapeCmds[0]],
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 574
      };
      hnm["o"]                     = {
        sC                         : [ "E·A% CÃA%BµB@ A­CTA­EH A­G:B¸HQ CÃIiE·Ii G«IiH¹HN IÁG:IÁEH IÁCTH¹B@ G«A%E·A%"],
        hC                         : [["E·BZ G#BZGuCN H:D2H:EH H:F]GuG@ G#H4E·H4 D§H4D4G@ CoF]CoEH CoD2D4CN D§BZE·BZ"]],
        xMin                       : 36,
        xMax                       : 558,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 593
      };
      hnm["ô"]                     = {
        sC                         : [circumflexCoded(176,0),hnm.o.sC[0]],
        hC                         : [[],hnm.o.hC[0]],
        xMin                       : 36,
        xMax                       : 558,
        yMin                       : -14,
        yMax                       : 731,
        width                      : 593
      };
      hnm["ö"]                     = {
        sC                         : [dieresisLeftCoded(176,0),dieresisRightCoded(176,0),hnm.o.sC[0]],
        hC                         : [[],[],hnm.o.hC[0]],
        xMin                       : 36,
        xMax                       : 558,
        yMin                       : -14,
        yMax                       : 707,
        width                      : 593
      };
      hnm["ó"]                     = {
        sC                         : [acuteCoded(176,0),hnm.o.sC[0]],
        hC                         : [[],hnm.o.hC[0]],
        xMin                       : 36,
        xMax                       : 558,
        yMin                       : -14,
        yMax                       : 731,
        width                      : 593
      };
      hnm["p"]                     = {
        shapeCmds                  : [[[177,-191],[63,-191],[63,517],[171,517],[171,447],[173,447],[219,531,333,531],[450,531,515,450],[575,376,575,256],[575,256],[575,143,521,69],[460,-14,352,-14],[230,-14,179,67],[177,67],[177,-191]]],
        holeCmds                   : [[[[461,258],[461,333,425,385],[385,441,318,441],[248,441,210.5,392],[173,343,173,258],[173,178,212,127],[251,76,318,76],[390,76,429,133],[461,182,461,258]]]],
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      hnm["q"]                     = {
        shapeCmds                  : [[[439,517],[547,517],[547,-191],[433,-191],[433,67],[431,67],[380,-14,258,-14],[150,-14,89,69],[35,143,35,256],[35,376,95,450],[160,531,277,531],[391,531,437,447],[439,447],[439,517]]],
        holeCmds                   : [[[[149,258],[149,182,182,133],[220,76,292,76],[364,76,402,127],[437,174,437,258],[437,343,399.5,392],[362,441,292,441],[225,441,185,385],[149,333,149,258]]]],
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      hnm["r"]                     = {
        shapeCmds                  : [[[174,0],[60,0],[60,517],[167,517],[167,417],[169,417],[179,460,224,495.5],[269,531,320,531],[333,531,363,528],[363,418],[323,423,314,423],[253,423,215,377],[174,329,174,246],[174,0]]],
        xMin                       : 60,
        xMax                       : 363,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 352
      };
      hnm["s"]                     = {
        // shapeCmds                  : [[[32,166],[146,166],[154,76,263,76],[381,76,378,144],[376,192,288,213],[141,249,129,255],[43,293,43,383],[43,460,116,499],[174,531,259,531],[346,531,402,495],[465,453,475,372],[356,372],[343,441,251,441],[157,441,157,388],[157,352,210,333],[220,329,325,305],[403,287,440,261],[492,223,492,154],[492,69,417,24],[354,-14,261,-14],[159,-14,99,30],[33,78,32,166]]],
        sC                         : ['A¥C± CgC± CwBZEPBZ G<BZG6Cc G2DBE¥Dm C]E4CDE@ A»E¯A»G@ A»HZC*I( CÁIiEHIi FwIiGgHÃ HeHLHyG* F­G* FqH4E8H4 C}H4C}GJ C}F¥DgF] D{FTFLF# GiE£H2EL H½D£H½Cw H½BLG§As F©A%ELA% C£A%B«A¡ A§B_A¥C±'],
        xMin                       : 32,
        xMax                       : 492,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 519
      };
      hnm["t"]                     = {
        shapeCmds                  : [[[94,432],[8,432],[8,517],[94,517],[94,672],[208,672],[208,517],[311,517],[311,432],[208,432],[208,156],[208,116,216,103],[227,85,263,85],[295,85,311,89],[311,1],[236,-5,237,-5],[153,-5,121,29],[94,57,94,127],[94,432]]],
        xMin                       : 8,
        xMax                       : 311,
        yMin                       : -5,
        yMax                       : 672,
        width                      : 333
      };
      hnm["u"]                     = {
        shapeCmds                  : [[[400,517],[514,517],[514,0],[402,0],[402,72],[400,72],[379,34,337.5,10],[296,-14,253,-14],[60,-14,60,189],[60,517],[174,517],[174,200],[174,76,273,76],[273,76],[400,76,400,217]]],
        // shapeCmds_old              : [[[400,517],[514,517],[514,0],[402,0],[402,72],[400,72],[,379,34,337.5,10],[296,-14,253,-14],[60,-14,60,189],[60,517],[174,517],[174,200],[174,76,273,76],[273,76],[400,76,400,217]]],
        // shapeCmds_a                : "M 400 517 L 514 517 L 514 0 L 402 0 L 402 72 L 400 72 Q 379 34 337.5 10 Q 296 -14 253 -14 Q 60 -14 60 189 L 60 517 L 174 517 L 174 200 Q 174 76 273 76 L 273 76 Q 400 76 400 217 Z",
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : -14,
        yMax                       : 517,
        width                      : 574
      };
      hnm["v"]                     = {
        shapeCmds                  : [[[325,0],[197,0],[9,517],[133,517],[264,120],[266,120],[392,517],[510,517],[325,0]]],
        xMin                       : 9,
        xMax                       : 510,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 519
      };
      hnm["w"]                     = {
        shapeCmds                  : [[[293,0],[173,0],[13,517],[134,517],[235,131],[237,131],[334,517],[449,517],[542,131],[544,131],[649,517],[765,517],[603,0],[486,0],[390,384],[388,384],[293,0]]],
        xMin                       : 13,
        xMax                       : 765,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 778
      };
      hnm["x"]                     = {
        shapeCmds                  : [[[138,0],[4,0],[199,272],[20,517],[158,517],[266,358],[379,517],[511,517],[335,278],[533,0],[396,0],[265,191],[138,0]]],
        xMin                       : 4,
        xMax                       : 533,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 537
      };
      hnm["y"]                     = {
        shapeCmds                  : [[[186,-38],[199,2],[3,517],[128,517],[263,131],[265,131],[396,517],[515,517],[314,-28],[280,-120,254,-152],[211,-205,131,-205],[91,-205,52,-199],[52,-103],[94,-110,106,-110],[142,-110,161,-90],[174,-76,186,-38]]],
        xMin                       : 3,
        xMax                       : 515,
        yMin                       : -205,
        yMax                       : 517,
        width                      : 519
      };
      hnm["z"]                     = {
        shapeCmds                  : [[[308,427],[42,427],[42,517],[462,517],[462,437],[166,90],[477,90],[477,0],[22,0],[22,80],[308,427]]],
        xMin                       : 22,
        xMax                       : 477,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 500
      };
      hnm["0"]                     = { 
        shapeCmds                  : [[[278,714],[414,714,474,592],[520,500,520,350],[520,200,474,108],[414,-14,278,-14],[142,-14,82,108],[36,200,36,350],[36,500,82,592],[142,714,278,714]]],
        holeCmds                   : [[[[278,81],[406,81,406,350],[406,619,278,619],[150,619,150,350],[150,81,278,81]]]],
        xMin                       : 36,
        xMax                       : 520,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      hnm["1"]                     = {
        shapeCmds                  : [[[225,494],[53,494],[53,584],[131,583,185,610],[245,641,257,700],[350,700],[350,0],[225,0],[225,494]]],
        xMin                       : 53,
        xMax                       : 350,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      hnm["2"]                     = {
        shapeCmds                  : [[[176,102],[517,102],[517,0],[39,0],[40,159,193,265],[241,297,288,329],[342,367,369,401],[403,445,404,495],[405,543,382,576],[352,619,286,619],[171,619,166,444],[52,444],[52,564,114,637],[179,714,293,714],[409,714,470,640],[518,581,518,499],[518,372,362,263],[304,224,246,185],[189,141,176,102]]],
        xMin                       : 39,
        xMax                       : 518,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 556
      };
      hnm["3"]                     = {
        shapeCmds                  : [[[228,325],[228,410],[293,407,334,432],[383,460,383,520],[383,564,352.5,591.5],[322,619,274,619],[218,619,187,576.5],[156,534,158,476],[44,476],[49,581,109,646],[173,714,276,714],[365,714,427,667],[497,615,497,527],[497,412,398,377],[398,375],[457,363,491,315.5],[525,268,525,200],[525,104,451,44],[381,-14,277,-14],[159,-14,94,53],[33,117,31,230],[145,230],[143,164,177,124],[212,81,277,81],[336,81,373.5,114.5],[411,148,411,206],[411,333,228,325]]],
        xMin                       : 31,
        xMax                       : 525,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      hnm["4"]                     = {
        shapeCmds                  : [[[432,256],[522,256],[522,166],[432,166],[432,0],[324,0],[324,166],[24,166],[24,279],[324,700],[432,700],[432,256]]],
        holeCmds                   : [[[[324,564],[322,564],[112,256],[324,256]]]],
        xMin                       : 24,
        xMax                       : 522,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      hnm["5"]                     = { 
        shapeCmds                  : [[[162,317],[48,317],[123,700],[485,700],[485,598],[208,598],[172,420],[174,418],[222,471,303,471],[405,471,465,404],[522,340,522,237],[522,140,466,70],[399,-14,280,-14],[175,-14,109,40],[39,97,35,199],[149,199],[154,143,188,112],[222,81,278,81],[408,81,408,235],[408,297,376,337],[340,381,275,381],[186,381,162,317]]],
        xMin                       : 34,
        xMax                       : 522,
        yMin                       : -14,
        yMax                       : 700,
        width                      : 556
      };
      hnm["6"]                     = {
        shapeCmds                  : [[[509,523],[395,523],[391,566,364,592.5],[337,619,293,619],[212,619,177,534],[156,483,148,379],[150,377],[197,460,301,460],[403,460,464,393],[522,328,522,225],[522,122,457.5,54],[393,-14,289,-14],[146,-14,84,93],[34,180,34,352],[34,498,92,596],[162,714,298,714],[383,714,444,660.5],[505,607,509,523]]],
        holeCmds                   : [[[[285,81],[343,81,377,126],[408,167,408,227],[408,287,376,328.5],[344,370,285,370],[225,370,191,327],[159,288,159,227],[159,166,191,126],[226,81,285,81]]]],
        xMin                       : 34,
        xMax                       : 522,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      hnm["7"]                     = {
        shapeCmds                  : [[[398,598],[35,598],[35,700],[514,700],[514,605],[277,337,253,0],[253,0],[128,0],[139,159,215,321],[285,470,398,598]]],
        xMin                       : 35,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      hnm["8"]                     = {
        shapeCmds                  : [[[278,-14],[169,-14,100,45.5],[31,105,31,206],[31,271,65.5,316.5],[100,362,159,377],[159,378],[60,417,60,523],[60,613,117,663.5],[174,714,278,714],[278,714],[382,714,439,663.5],[496,613,496,523],[496,417,397,378],[397,377],[456,362,490.5,316.5],[525,271,525,206],[525,105,456,45.5],[387,-14,278,-14]]],
        holeCmds                   : [[[[278,76],[336,76,373.5,111],[411,146,411,206],[411,263,373.5,296],[336,329,278,329],[220,329,182.5,296],[145,263,145,206],[145,146,182.5,111],[220,76,278,76,]], [[278,624],[230,624,199,595.5],[168,567,168,517],[168,469,198.5,441.5],[229,414,278,414],[327,414,357.5,441.5],[388,469,388,517],[388,567,357,595.5],[326,624,278,624]]]],
        xMin                       : 31,
        xMax                       : 525,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      hnm["9"]                     = {
        shapeCmds                  : [[[47,177],[161,177],[165,134,192,107.5],[219,81,263,81],[344,81,379,167],[400,217,408,321],[406,323],[359,239,255,239],[156,239,95,303.5],[34,368,34,475],[34,580,98.5,647],[163,714,275,714],[413,714,473,608],[522,520,522,348],[522,202,464,104],[394,-14,258,-14],[173,-14,112,39.5],[51,93,47,177]]],
        holeCmds                   : [[[[270,619],[211,619,178,576],[148,537,148,476],[148,414,178,374],[211,329,270,329],[331,329,365,374],[397,414,397,476],[397,536,364,577.5],[331,619,270,619]]]],
        xMin                       : 34,
        xMax                       : 522,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      hnm["%"]                     = {
        shapeCmds                  : [
                                       [[338,-24],[260,-24],[649,724],[725,724],[338,-24]],
                                       [[751,-14],[665,-14,622,45],[584,96,584,185],[584,272,624,325],[668,384,751,384],[834,384,878,325],[918,272,918,185],[918,96,880,45],[837,-14,751,-14]],
                                       [[249,316],[163,316,120,375],[82,426,82,515],[82,602,122,655],[166,714,249,714],[332,714,376,655],[416,602,416,515],[416,426,378,375],[335,316,249,316]]
                                     ],
        holeCmds                   : [
                                       [],
                                       [[[674,185],[674,51,750,51],[828,51,828,185],[828,319,750,319],[674,319,674,185]]],
                                       [[[172,515],[172,381,248,381],[326,381,326,515],[326,649,248,649],[172,649,172,515]]]
                                     ],
        xMin                       : 82,
        xMax                       : 918,
        yMin                       : -24,
        yMax                       : 724,
        width                      : 1000
      };
      hnm["#"]                     = {
        shapeCmds                  : [[[410,285],[495,285],[495,210],[400,210],[370,0],[290,0],[319,210],[209,210],[179,0],[99,0],[128,210],[34,210],[34,285],[139,285],[157,415],[63,415],[63,490],[167,490],[196,700],[277,700],[247,490],[358,490],[387,700],[468,700],[438,490],[524,490],[524,415],[428,415],[410,285]]],
        holeCmds                   : [[[[330,285],[348,415],[237,415],[219,285],[330,285]]]],
        xMin                       : 34,
        xMax                       : 524,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      hnm["$"]                     = {
        shapeCmds                  : [[[17,217],[131,217],[129,77,259,73],[259,315],[154,344,105,382],[32,437,32,535],[32,626,101,681],[165,731,259,731],[259,809],[302,809],[302,731],[397,731,457,683],[521,631,521,536],[407,536],[402,641,302,641],[302,430],[414,400,466,361],[539,306,539,208],[539,101,470,42],[408,-12,302,-17],[302,-95],[259,-95],[259,-17],[148,-15,82,46.5],[16,108,17,217]]],
        holeCmds                   : [[[[302,306],[302,73],[425,82,425,192],[425,243,387,271],[360,291,302,306]],[[259,441],[259,641],[146,641,146,543],[146,469,259,441]]]],
        xMin                       : 16,
        xMax                       : 539,
        yMin                       : -95,
        yMax                       : 809,
        width                      : 556
      };
      hnm["&"]                     = {
        shapeCmds                  : [[[662,0],[522,0],[457,80],[380,-14,257,-14],[157,-14,94.5,42.5],[32,99,32,198],[32,321,196,405],[124,496,124,561],[124,637,174.5,684],[225,731,299,731],[373,731,423,688],[477,641,477,560],[477,448,348,379],[459,245],[475,290,481,341],[581,341],[569,235,525,166],[662,0]]],
        holeCmds                   : [[[[302,646],[270,646,248,624],[226,602,226,567],[226,537,249,503],[270,476,291,448],[332,476,349,496],[375,526,375,564],[375,600,355,623],[335,646,302,646]],[[396,156],[256,330],[189,289,185,285],[146,251,146,196],[146,140,178,108],[210,76,261,76],[315,76,351,105],[367,117,396,156]]]],
        xMin                       : 32,
        xMax                       : 662,
        yMin                       : -14,
        yMax                       : 731,
        width                      : 648
      };
      hnm["?"]                     = {
        shapeCmds                  : [[[163,487],[49,487],[48,598,113.5,664.5],[179,731,289,731],[384,731,445.5,677],[507,623,507,529],[507,467,479,425],[464,401,419,363],[371,323,356,298],[331,259,331,194],[223,194],[223,277,242,322],[258,360,301,397],[348,438,358,450],[382,481,382,525],[382,580,347,611],[318,636,284,636],[163,636,163,487]],[[342,0],[208,0],[208,125],[342,125],[342,0]]],
        xMin                       : 48,
        xMax                       : 507,
        yMin                       : 0,
        yMax                       : 731,
        width                      : 556
      };
      hnm["!"]                     = {
        fullPath                   : "M 110 199 L 77 508 L 77 714 L 202 714 L 202 508 L 169 199 L 110 199 Z M 206 0 L 72 0 L 72 125 L 206 125 L 206 0 Z",
        shapeCmds                  : [[[110,199],[77,508],[77,714],[202,714],[202,508],[169,199],[110,199]],[[206,0],[72,0],[72,125],[206,125],[206,0]]],
        xMin                       : 72,
        xMax                       : 206,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 278
      };
      hnm["|"]                     = {
        shapeCmds                  : [[[162,-17],[60,-17],[60,731],[162,731],[162,-17]]],
        xMin                       : 60,
        xMax                       : 162,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 222
      };
      hnm["("]                     = {
        shapeCmds                  : [[[286,-191],[193,-191],[49,38,49,270],[49,509,193,731],[286,731],[163,511,163,270],[163,17,286,-191]]],
        xMin                       : 49,
        xMax                       : 286,
        yMin                       : -191,
        yMax                       : 731,
        width                      : 278
      };
      hnm[")"]                     = {
        shapeCmds                  : [[[-8,731],[85,731],[229,501,229,269],[229,29,85,-191],[-8,-191],[115,27,115,269],[115,522,-8,731]]],
        xMin                       : -8,
        xMax                       : 229,
        yMin                       : -191,
        yMax                       : 731,
        width                      : 278
      };
      hnm["["]                     = {
        shapeCmds                  : [[[295,-191],[72,-191],[72,731],[295,731],[295,641],[180,641],[180,-101],[295,-101]]],
        xMin                       : 72,
        xMax                       : 295,
        yMin                       : -191,
        yMax                       : 731,
        width                      : 296
      };
      hnm["]"]                     = {
        shapeCmds                  : [[[1,731],[224,731],[224,-191],[1,-191],[1,-101],[116,-101],[116,641],[1,641]]],
        xMin                       : 1,
        xMax                       : 224,
        yMin                       : -191,
        yMax                       : 731,
        width                      : 296
      };
      hnm["="]                     = {
        shapeCmds                  : [[[48,405],[552,405],[552,303],[48,303],[48,405]],[[48,203],[552,203],[552,101],[48,101],[48,203]]],
        xMin                       : 48,
        xMax                       : 552,
        yMin                       : 101,
        yMax                       : 405,
        width                      : 600
      };
      hnm["+"]                     = {
        shapeCmds                  : [[[48,304],[249,304],[249,506],[351,506],[351,304],[552,304],[552,202],[351,202],[351,0],[249,0],[249,202],[48,202]]],
        xMin                       : 48,
        xMax                       : 552,
        yMin                       : 0,
        yMax                       : 506,
        width                      : 600
      };
      hnm["-"]                     = {
        shapeCmds                  : [[[355,218],[34,218],[34,326],[355,326]]],
        xMin                       : 34,
        xMax                       : 355,
        yMin                       : 218,
        yMax                       : 326,
        width                      : 429
      };
      hnm["/"]                     = {
        shapeCmds                  : [[[87,-17],[-22,-17],[265,731],[374,731]]],
        xMin                       : -22,
        xMax                       : 374,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 352
      };
      hnm["*"]                     = {
        fullPath                   : "M 60 440 L 130 534 L 19 572 L 41 637 L 151 594 L 151 714 L 219 714 L 219 594 L 328 637 L 352 572 L 238 534 L 308 440 L 255 401 L 184 499 L 116 401 L 60 440 Z",
        shapeCmds                  : [[[60,440],[130,534],[19,572],[41,637],[151,594],[151,714],[219,714],[219,594],[328,637],[352,572],[238,534],[308,440],[255,401],[184,499],[116,401],[60,440]]],
        xMin                       : 19,
        xMax                       : 352,
        yMin                       : 401,
        yMax                       : 714,
        width                      : 370
      };
      hnm[";"]                     = {
        fullPath                   : "M 69 0 L 69 135 L 208 135 L 208 0 Q 208 -61 170.5 -103.5 Q 133 -146 73 -158 L 73 -97 Q 105 -89 122 -61.5 Q 139 -34 138 0 Z M 208 371 L 69 371 L 69 506 L 208 506 Z",
        shapeCmds                  : [[[69,0],[69,135],[208,135],[208,0],[208,-61,170.5,-103.5],[133,-146,73,-158],[73,-97],[105,-89,122,-61.5],[139,-34,138,0]],[[208,371],[69,371],[69,506],[208,506]]],
        xMin                       : 69,
        xMax                       : 208,
        yMin                       : -158,
        yMax                       : 506,
        width                      : 278
      };
      hnm[":"]                     = {
        fullPath                   : "M 208 371 L 69 371 L 69 506 L 208 506 L 208 371 Z M 208 0 L 69 0 L 69 135 L 208 135 L 208 0 Z",
        shapeCmds                  : [[[208,371],[69,371],[69,506],[208,506],[208,371]],[[208,0],[69,0],[69,135],[208,135],[208,0]]],
        xMin                       : 69,
        xMax                       : 208,
        yMin                       : 0,
        yMax                       : 506,
        width                      : 278
      };
      hnm['"']                     = {
        fullPath                   : "M 185 432 L 83 432 L 83 714 L 185 714 L 185 432 Z M 361 432 L 259 432 L 259 714 L 361 714 L 361 432 Z",
        shapeCmds                  : [[[185,432],[83,432],[83,714],[185,714],[185,432]],[[361,432],[259,432],[259,714],[361,714],[361,432]]],
        xMin                       : 83,
        xMax                       : 361,
        yMin                       : 432,
        yMax                       : 714,
        width                      : 444
      };
      hnm["'"]                     = {
        shapeCmds                  : [[[190,432],[88,432],[88,714],[190,714],[190,432]]],
        xMin                       : 88,
        xMax                       : 190,
        yMin                       : 432,
        yMax                       : 714,
        width                      : 278
      };
      hnm[","]                     = {
        fullPath                   : "M 138 0 L 69 0 L 69 135 L 208 135 L 208 0 Q 208 -61 170.5 -103.5 Q 133 -146 73 -158 L 73 -158 L 73 -97 Q 105 -89 122 -61.5 Q 139 -34 138 0 Z",
        shapeCmds                  : [[[138,0],[69,0],[69,135],[208,135],[208,0],[208,-61,170.5,-103.5],[133,-146,73,-158],[73,-158],[73,-97],[105,-89,122,-61.5],[139,-34,138,0]]],
        xMin                       : 69,
        xMax                       : 208,
        yMin                       : -158,
        yMax                       : 135,
        width                      : 278
      };
      hnm["."]                     = {
        shapeCmds                  : [[[208,0],[69,0],[69,135],[208,135],[208,0]]],
        xMin                       : 69,
        xMax                       : 208,
        yMin                       : 0,
        yMax                       : 135,
        width                      : 278
      };
      hnm[nbsp]                    = {
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 278
      };
      hnm[" "]                     = hnm[nbsp];

      return hnm;

      //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  
      // To support non-english letters, we need a variety of new symbols: acute, dieresis, etc.
      // It turns out that these symbols can be re-used, with some placement changes
      // To save space and code, that's what we do
      // These functions return the special symbols in compressed or raw forms
      function acuteRaw(dx,dy){
        return [[128+dx,588+dy],[45+dx,588+dy],[135+dx,731+dy],[270+dx,731+dy]]
      };
      function acuteCoded(dx,dy){
        return codeList(acuteRaw(dx,dy))
      };
      function circumflexRaw(dx,dy){
        return [[120+dx,678+dy],[50+dx,588+dy],[-42+dx,588+dy],[65+dx,731+dy],[176+dx,731+dy],[284+dx,588+dy],[191+dx,588+dy]]
      };
      function circumflexCoded(dx,dy){
        return codeList(circumflexRaw(dx,dy))
      };
      function dieresisLeftRaw(dx,dy){
        return [[92+dx,599+dy],[-22+dx,599+dy],[-22+dx,707+dy],[92+dx,707+dy]]
      };
      function dieresisLeftCoded(dx,dy){
        return codeList(dieresisLeftRaw(dx,dy))
      };
      function dieresisRightRaw(dx,dy){
        return [[150+dx,707+dy],[264+dx,707+dy],[264+dx,599+dy],[150+dx,599+dy]]
      };
      function dieresisRightCoded(dx,dy){
        return codeList(dieresisRightRaw(dx,dy))
      };
      function graveRaw(dx,dy){
        return [[113+dx,588+dy],[-29+dx,731+dy],[105+dx,731+dy],[196+dx,588+dy]]
      };
      function graveCoded(dx,dy){
        return codeList(graveRaw(dx,dy))
      };
      function tildeRaw(dx,dy){
        return [[297+dx,714+dy],[279+dx,599+dy,186+dx,599+dy],[163+dx,599+dy,113.5+dx,617.5+dy],[64+dx,636+dy,43+dx,636+dy],[26+dx,636+dy,13.5+dx,623+dy],[1+dx,610+dy,1+dx,595+dy],[-56+dx,595+dy],[-49+dx,639+dy,-24+dx,671+dy],[6+dx,708+dy,48+dx,708+dy],[81+dx,708+dy,127.5+dx,689+dy],[174+dx,670+dy,191+dx,670+dy],[229+dx,670+dy,241+dx,714+dy]]
      };
      function tildeCoded(dx,dy){
        return codeList(tildeRaw(dx,dy))
      };
      function dotlessiRaw(){
        return [[177,517],[177,0],[63,0],[63,517]]
      };
      function dotlessiCoded(){
        return codeList(dotlessiRaw(dx,dy))
      };
  };

  /*
// https://opentype.js.org/glyph-inspector.html
function coordinates(cmd){
  if(cmd.x1){
    return " "+cmd.x1+" "+(0-cmd.y1)+" "+cmd.x+" "+(0-cmd.y)
  }else{
    if(cmd.x){
      return " "+cmd.x+" "+(0-cmd.y)
    }else{
      return ""
    }
  }
};
function makeD(path){
  var d  = "";
  path.commands.forEach(function(cmd){d+=" "+cmd.type+coordinates(cmd)});
  return d.slice(1)
}
*/

  //  COMICSANS-NORMAL  COMICSANS-NORMAL  COMICSANS-NORMAL  COMICSANS-NORMAL 
  //
  //
  CSN                            = function(codeList){

      var csn={reverseHoles:false,reverseShapes:true},nbsp="\u00A0";
      csn["A"]                     = {
        sC                         : ["K#A# JHA#I§B³ IkCkICEK H^E=G8D¼ E.Dc D}C`C¦Ad CdA+C,A+ B§A+BeAH BEAfBEA³ BEB@C]D~ CKDºCKE9 CKE­D-EÄ DÂGxFMI° H:L«HuL« ICL«IaK½ IÂIJ K4C¶ KnBv K­B#K­A¬ K­A_KlAA KLA#K#A#"],
        hC                         : [["H·F¼ HCI¾ F$FN FÁFnH·F¼"]],
        xMin                       : 65,
        xMax                       : 676,
        yMin                       : -15,
        yMax                       : 739,
        width                      : 749
      };
      csn["B"]                     = {
        sC                         : ["H8Ak FW@µCz@µ CN@µC&A: B¤AdB¤A± B¤D1 B¤E@B¶GI C&IhC)Jh C(KCC4Lz C;M+CUM; D^MfE­Mf G:MfH]Ln IºKdIºI» IºGºHOF¦ IfFCJ/Ev J{E&J{DK J{CRIxBb H¿A´H8Ak"],
        hC                         : [["E­K¼ DÀK¼DrKµ DpJd D[Ga EjGTEtGU F­GbGkH3 HQH¯HQI» HQJxGiKH F¢K¼E­K¼","F{Ey E³E¬ E¦E¬EiEª ENE©E@E© D­E©DME² DGD´DGD. DGB` FMBiGsC) H8CDHyC~ I5D1I5DK I5D{H5E5 GUEcF{Ey"]],
        xMin                       : 95,
        xMax                       : 604,
        yMin                       : -24,
        yMax                       : 785,
        width                      : 645
      };
      csn["C"]                     = {
        sC                         : ['IµJ# IRJ#I2Jp H¹K/H¡K= HjKHG¹KH F¨KHETIk CeG@CeE5 CeD4D7CW D¯BxE§Bx FlBxGSC, G°CJH¨D! I>DLI[DL I©DLJ"D+ J@C®J@Cd J@C6I½B· GµA*E§A* D5A*C%BI A¿CdA¿E5 A¿G«D8Jm F$L¸G¹L¸ HGL¸HoL³ H¸L¯I3L¥ IVM5I±M5 JSM5JfLZ JvK¬JvJ¶ JvJkJ`JK JDJ#IµJ#'],
        xMin                       : 45,
        xMax                       : 601,
        yMin                       : -12,
        yMax                       : 761,
        width                      : 617
      };
      csn["D"]                     = {
        // fullPath                   : "M 538 3.5 Q 460.5 -49.5 315.5 -49.5 Q 279 -49.5 232 -38 Q 175.5 -24.5 147 -3 L 142 -3 Q 120.5 -3 106 12 Q 91.5 27 91.5 48.5 Q 91.5 101 96 205.5 Q 101 310.5 101 363 Q 101 421.5 98.5 537.5 Q 96.5 654 96.5 712.5 Q 96.5 733 117.5 755.5 Q 138.5 778 159.5 778 Q 171.5 778 239.5 744.5 Q 316.5 707 328.5 703 Q 470.5 654.5 570.5 554 Q 688 435.5 688 293.5 Q 688 208 647.5 129.5 Q 607.5 51 538 3.5 Z M 433 532.5 Q 382 566 197.5 647.5 L 200 503.5 L 201.5 360 L 193.5 87 Q 197 85.5 204 80.5 Q 248 51 315 51 Q 429 51 481 86 Q 529.5 119 558 174.5 Q 587 230.5 587 291 Q 587 432 433 532.5 Z",
        // shapeCmds                  : [[[538,3.5],[460.5,-49.5,315.5,-49.5],[279,-49.5,232,-38],[175.5,-24.5,147,-3],[142,-3],[120.5,-3,106,12],[91.5,27,91.5,48.5],[91.5,101,96,205.5],[101,310.5,101,363],[101,421.5,98.5,537.5],[96.5,654,96.5,712.5],[96.5,733,117.5,755.5],[138.5,778,159.5,778],[171.5,778,239.5,744.5],[316.5,707,328.5,703],[470.5,654.5,570.5,554],[688,435.5,688,293.5],[688,208,647.5,129.5],[607.5,51,538,3.5]]],
        sC                         : ['IwAI H[@`F9@` Eq@`Dµ@w CÄ@´CiA< C_A< C3A<B¹AZ BzAyBzB" BzB¯B¥D^ B¯F/B¯F» B¯G°BªIv B¦K_B¦LS B¦L}C-M) CWMVC¤MV C¼MVDÄL¶ F;LHFSL@ HpK`J7I¹ L!H)L!E° L!DcKQCE J¤B(IwAI'],
        // holeCmds                   : [[[[433,532.5],[382,566,197.5,647.5],[200,503.5],[201.5,360],[193.5,87],[197,85.5,204,80.5],[248,51,315,51],[429,51,481,86],[529.5,119,558,174.5],[587,230.5,587,291],[587,432,433,532.5]]]],
        hC                         : [['#Il G>J.DMKQ DRI1 DUFµ DEBq DLBnDZBd E2B(F8B( G¿B(H§Bo IfC0IÁCÂ JXD²JXE« JXH!H#Il']],
        xMin                       : 91,
        xMax                       : 688,
        yMin                       : -50,
        yMax                       : 778,
        width                      : 739
      };
      csn["E"]                     = {
        xMin                       : 76,
        xMax                       : 597,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 630
      };
      csn["F"]                     = {
        xMin                       : 76,
        xMax                       : 569,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 593
      };
      csn["L"]                     = {
        xMin                       : 50,
        xMax                       : 440,
        yMin                       : 0,
        yMax                       : 755,
        width                      : 474
      };
      csn["N"]                     = {
        xMin                       : 71,
        xMax                       : 650,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      csn["O"]                     = {
        xMin                       : 38,
        xMax                       : 722,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 760
      };
      csn["R"]                     = {
        xMin                       : 76,
        xMax                       : 680,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 704
      };
      csn["S"]                     = {
        xMin                       : 33,
        xMax                       : 615,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 648
      };
      csn["T"]                     = {
        sC                         : ['K·K1 KJK1J0K= H½KHHLKG G¨KG G«J=GÃGª H6EgH6DF H6D"H=C] HDB¸HDBr HDB-H.A} GµA:GWA: G/A:F²AV FpAsFpAÁ FpB-FuBK FzBjFzBy FzC)FsC® FmDnFmDÂ FmF.FUH1 F=JIF:KC E`KB C§KBBªKc B6KxB6LE B6LoBPL° BoM0BÀM- C@M+D=L¾ DÄL²E`L² E¾L²F¸L´ G²L·HKL· H»L·J/L¬ KGL¡K·L¡ L?L¡L]La LzLCLzKº LzKmL]KN L?K1K·K1'],
        // shapeCmds                  : [[[681,631.5],[644,631.5,567,637.5],[492,643,453,642.5],[417.5,642.5],[419,573.5,431,418.5],[442,274,442,194],[442,176.5,445.5,141],[449,105.5,449,87.5],[449,53.5,438,29],[424,-4,394.5,-4],[374.5,-4,358.5,10],[342.5,24,342.5,46],[342.5,53.5,345,68.5],[347.5,83.5,347.5,91],[347.5,115.5,344,164.5],[341,213.5,341,238.5],[341,310,329.5,439.5],[317.5,579.5,316,640.5],[270.5,640],[161,640,98.5,656],[58,666.5,58,705.5],[58,726,71,741.5],[86,759,109.5,757.5],[127,756.5,189.5,748.5],[239.5,742.5,270.5,742.5],[300.5,742.5,361.5,743.5],[422.5,745,452.5,745],[491,745,566.5,739.5],[642.5,734,681,734],[702.5,734,717,719],[731.5,704.5,731.5,682.5],[731.5,661,717,646],[702.5,631.5,681,631.5]]],
        xMin                       : 58,
        xMax                       : 731,
        yMin                       : -4,
        yMax                       : 757,
        width                      : 696
      };
      csn["Z"]                     = {
        // shapeCmds                  : [[[633,625.5],[565.5,579.5],[474.5,509,359.5,354],[184,98.5],[171.5,79.5,159.5,63.5],[354,71],[481.5,77,549,77],[615,77,646.5,71],[687,63,688.5,30],[689.5,5.5,672.5,-9],[657.5,-21.5,635,-21.5],[620.5,-21.5,591.5,-20],[562.5,-18,548,-18],[472,-18,319.5,-22],[167.5,-25.5,91.5,-25.5],[34,-25.5,34,25],[34,58,65,108],[118.5,182.5],[299,433.5],[410.5,581,506.5,662.5],[331.5,652.5],[129.5,652.5],[124,652.5,113,651.5],[102.5,651,97.5,651],[44.5,651,44.5,702.5],[44.5,736.5,71.5,747.5],[88,754.5,126,754.5],[160.5,754.5,228.5,747],[297,740,331.5,740],[370,740,446.5,745],[523.5,750,562.5,750],[691,750,691,701.5],[691,668.5,633,625.5]]],
        sC                         : ['K4K$ J-JI HxI<F´F© D2Bª C¼BbC¤BA F©BP H¨B]I¯B] J³B]KOBP KÃB@L"A¡ L$AMK¦A0 Kf@ºK8@º J¾@ºJb@½ J&@ÁI­@Á Hs@ÁFA@¹ C´@²Bz@² A©@²A©Au A©B6BDB½ C/D/ E»H$ GxJLI7Kp FYK[ CEK[ C:K[C#KY B²KXB¨KX A¾KXA¾L? A¾L¦BQL¼ BsM&C>M& C¦M&D®L» E·L­FYL­ G%L­H?L· IYLÁJ&LÁ L(LÁL(L= L(K|K4K$'],
        xMin                       : 34,
        xMax                       : 691,
        yMin                       : -25,
        yMax                       : 755,
        width                      : 710
      };
      csn["a"]                     = {
        sC                         : ["HZ@£ HG@£G¸A, GiAUGRAv FsAAF)A% Ea@¯E/@¯ CE@¯BZA³ AvB¯AvD¯ AvF¡B¾H* DBIVF)IV F£IVGmI) HuHrHuH! HuGªHaGs HVGLHPFv HKEÁHJD¹ HIC½H[CR HfC%H½B! HÄA³I1An I7A] I7A4H¾@½ H¢@£HZ@£"],
        hC                         : [["F­F7 F­FcF²F· F¸GGFÃG£ F|G¶FaG¿ FFH$F6H$ D¾H$D*G% C:F(C:D¦ C:C`CuB° D.B;E!B; E¥B;FEB_ FjBrG*C* F­E3F­F7"]],
        xMin                       : 25,
        xMax                       : 506,
        yMin                       : -33,
        yMax                       : 522,
        width                      : 524
      };
      csn["b"]                     = {
        sC                         : ['EÃ@» Dª@»C­AT CkA#C<A# B¹A#B|A> BbAYBbA¤ BbA¾BdBN BgB¤BgB¾ BgC¨BaEX B[G,B[G¹ B[H`B]J* B^KwB^L@ B^L}BwM, BºMjCQMj C¿MjC¿Lµ C¿L§CºLj CµLNCµL@ C²Jf C°Hg DeHÄE2I> E¤I]FFI] GÀI]I"H7 IÄF¿IÄE: IÄE: IÄCVH±B7 G|@»EÃ@»'],
        hC                         : [['FFGÂ EuGÂDÁGr DuGZC±F± C¯Eb C°DE C±BÄ D>B®D¸Bj ESBVEÃBV G1BVG±C< HlD!HlE: HlFOGÃG3 GOGÂFFGÂ']],
        xMin                       : 76,
        xMax                       : 560,
        yMin                       : -21,
        yMax                       : 788,
        width                      : 607
      };
      csn["c"]                     = {
        sC                         : ['E´@¦ DD@¦C;A¢ B+B¤B+DV B+EÄC2Gz DHIjE§Ij FgIjG`I; HyH£HyH+ HyG¨H`Gh HFGJGÄGJ G§GJGoG[ GYGnGEG¡ F­H-E§H- DÁH-D:Fx C`EPC`DV C`CRD9B© D°B?E´B? FMB?F´B` G¨BÀ H"C-H0C- HUC-HqB² H®BsH®BL H®A¦GrA? Fk@¦E´@¦'],
        xMin                       : 52,
        xMax                       : 484,
        yMin                       : -31,
        yMax                       : 531,
        width                      : 526
      };
      csn["d"]                     = {
        sC                         : ['IgH5 IZG!IZE² IZCBIzA» I|A­I|A¤ I|AYI`A? ICA$HÁA$ HaA$HCA¢ G|AJG-A/ Fa@·E¯@· D=@·C5AÁ B)C+B)D« B)F¶C6H4 DDIUF%IU F½IUGYI1 H7Hm HEK´HXM" HfM}I3M} I±M}I±L¾ I±K³IgH5'],
        hC                         : [['F*G¾ D¥G¾D.G7 CZFTCZD¯ CZC®D5C. D´BQE¯BQ FaBQF½Bq G<B¥G¬CC G»CPH%Cc H"D² H#E¦ H%Fz G£GJGAGs F¥G¾F*G¾']],
        xMin                       : 51,
        xMax                       : 550,
        yMin                       : -23,
        yMax                       : 797,
        width                      : 601
      };
      csn["e"]                     = {
        sC                         : ['EÃ@· D>@·C2A¨ A¼B¥A¼Dd A¼FhBºGº CÃIWE¨IW G+IWG·HÂ H¸HZH¸GK H¸FhH#E¸ GsErFPE$ CRCq C­BÀD^Bt E1BIEÃBI FfBIGBBd H8B§HZC9 H}CpI"Cp IFCpIbCT I~C:I~Bº I~B(HJAX G1@·EÃ@·'],
        hC                         : [['E¨H" D®H"D:GD CjFgCAE( EuF: G)FµGwGS FÃH"E¨H"']],
        xMin                       : 43,
        xMax                       : 541,
        yMin                       : -23,
        yMax                       : 522,
        width                      : 561
      };
      csn["f"]                     = {
        sC                         : ['GnL@ E|L@E_Iq E[I2 F¨I>G7I> HVI>HVHZ HVG´G«G¦ GgG~G8G¡ F®G£ERGr EJE° EJEOENDS ERCWERB½ ERA]E<@s E+@!D`@! D6@!C¼@< C}@WC}@¢ C}@ªC¡@¶ C¶A¸C¶C. C³E? C³Gb B¶GWBsGW A°GWA°H8 A°H¾C<HÃ C¿I" CÂI[D+J; DEK¼D¾L¥ E¦M¤GaM¤ HpM¤HpLÃ HpL@GnL@'],
        xMin                       : 38,
        xMax                       : 470,
        yMin                       : -80,
        yMax                       : 800,
        width                      : 520
      };
      csn["g"]                     = { 
        sC                         : ['H§Dr HnAÄ Hh@YHD?Z Gº>8G4=l F<<±DY<± CT<±B{<Ã A}=9A}=« A}>bBS>b Bx>bCK>O CÂ>>D¨>@ FE>CF±?{ G>@uGABr F®A°F@A[ EwA)D¹A) CbA)BpB# A¡BÃA¡Df A¡FtB¼G» D9IBFMIB G*IBGjI* H(HµHIHc I4H`I4Gl I4G#HÂF- H«E"H§Dr'],
        hC                         : [['FCH! D¨H!CÀFÂ C@F)C@Dt C@CcCxB¼ D.BPD¿BP E¤BPFaCB G6D+GBDµ GWE¡GpGf GGG§F¿G¶ FrH!FCH!']],
        xMin                       : 29,
        xMax                       : 505,
        yMin                       : -282,
        yMax                       : 512,
        width                      : 544
      };
      csn["h"]                     = {
        sC                         : ['Hµ@§ HK@§H5AP GÁB!G®C9 GzDJGzE& GzEAG|Ew G¡F+G¡FE G¡G¤FÃG¤ EÄG¤E=F± D­FSD1E- D1B0C´Ak CvA,C:A, B´A,BsAH BSAeBSA¯ BSA½B]B8 BeBQBhCJ BkD_ BnJ= BuK9BuKe BuKºBkLD BbLsBbM" BbMMB¡Mi B¾M§CEM§ CºM§D$M, D5LKD5K~ D5J·D.J! D(I5D)HG D*Gp D}H^EYH¶ F7IJFÃIJ HFIJH§H_ I0GµI6F_ I>DÂ IRCO IaBZIuA¤ IyAqIyAe IyA;IZ@Â I<@§Hµ@§'],
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      csn["i"]                     = {
        sC                         : ["C¯K4 C]K4C9KV B¹KyB¹L( B¹LXC9L{ C]L¿C¯L¿ D<L¿D_L{ D¤LXD¤L( D¤KyD_KV D<K4C¯K4","D9D« D9DLD<CT D@B^D@AÄ D@AvD$AY C­A=C_A= C3A=BºAY B}AvB}AÄ B}B^ByCT BvDLBvD« BvEgB¢Fs B¬G¢B¬H^ B¬H­C#I% C@IBClIB C¹IBD1I% DMH­DMH^ DMG¢DCFs D9EgD9D«"],
        xMin                       : 89,
        xMax                       : 223,
        yMin                       : -2,
        yMax                       : 749,
        width                      : 287
      };
      csn["j"]                     = {
        // fullPath                   : "M 233.5 632.5 Q 209.5 632.5 192 649.5 Q 175 666.5 175 690 Q 175 714 192 731 Q 209.5 748 233.5 748 Q 257.5 748 275 731 Q 292.5 714 292.5 690 Q 292.5 666.5 275 649.5 Q 257.5 632.5 233.5 632.5 Z M 229.5 -116 Q 230 -57.5 212.5 183.5 L 195.5 459 Q 195.5 484 209.5 503.5 Q 224 523 246 523 Q 263 523 280 510.5 Q 297 498 298 485 L 314.5 197 L 328 -111 Q 328 -180.5 286.5 -237 Q 241.5 -298.5 177 -298.5 Q 69.5 -298.5 -3 -133 Q -9 -119.5 -9 -109 Q -9 -89 6.5 -74.5 Q 22.5 -60 42.5 -60 Q 72 -60 104 -125 Q 112 -142 132 -174 Q 151.5 -199 177 -199 Q 199 -199 214.5 -166 Q 226.5 -141 229.5 -116 Z",
        // shapeCmds                  : [[[233.5,632.5],[209.5,632.5,192,649.5],[175,666.5,175,690],[175,714,192,731],[209.5,748,233.5,748],[257.5,748,275,731],[292.5,714,292.5,690],[292.5,666.5,275,649.5],[257.5,632.5,233.5,632.5]],[[229.5,-116],[230,-57.5,212.5,183.5],[195.5,459],[195.5,484,209.5,503.5],[224,523,246,523],[263,523,280,510.5],[297,498,298,485],[314.5,197],[328,-111],[328,-180.5,286.5,-237],[241.5,-298.5,177,-298.5],[69.5,-298.5,-3,-133],[-9,-119.5,-9,-109],[-9,-89,6.5,-74.5],[22.5,-60,42.5,-60],[72,-60,104,-125],[112,-142,132,-174],[151.5,-199,177,-199],[199,-199,214.5,-166],[226.5,-141,229.5,-116]]],
        sC                         : ['D¸K3 DfK3DBKU CÃKxCÃL% CÃLVDBLy DfL½D¸L½ EEL½EiLy E®LVE®L% E®KxEiKU EEK3D¸K3','D°?Z D±@ODlD1 DIHX DIH­DfI1 D¥IXE.IX EPIXEsI? E·I%E¹H¯ F7DL FR?e FR>YE¢=i E$<nD#<n BM<nA<?8 A0?SA0?i A0?³AO@- Ap@JAº@J BR@JBµ?H C!?%CJ>g Cr>4D#>4 DP>4Dp>w Dª?(D°?Z'],
        xMin                       : -9,
        xMax                       : 328,
        yMin                       : -299,
        yMax                       : 748,
        width                      : 413
      };
      csn["k"]                     = {
        // fullPath                   : "M 486 -20.5 Q 458.5 -20.5 443.5 8.5 Q 417.5 59 365 128 L 276.5 248.5 Q 247.5 225.5 186.5 184 Q 181 106.5 181 33 Q 181 10.5 167 -3.5 Q 153.5 -17.5 132 -17.5 Q 81.5 -17.5 81.5 50.5 Q 81.5 92 87 174.5 Q 93 257.5 93 299 Q 93 375 95 472.5 Q 97.5 570.5 97.5 645.5 Q 97.5 668 95 698.5 Q 93 729 93 751.5 Q 93 774 106.5 788 Q 120.5 802 142 802 Q 163.5 802 177 788 Q 191 774 191 751.5 Q 191 728.5 193.5 697 Q 196 666 196 643 L 192.5 482 Q 190 395 191 308 Q 259 360 322 422 L 432 535.5 Q 448.5 552.5 467.5 552.5 Q 487 552.5 502.5 537 Q 518.5 521.5 518.5 501 Q 518.5 484 504 467.5 Q 442.5 395.5 352.5 313 L 461.5 164.5 Q 538 60 538 28.5 Q 538 8.5 522 -6 Q 506.5 -20.5 486 -20.5 Z",
        // shapeCmds                  : [[[486,-20.5],[458.5,-20.5,443.5,8.5],[417.5,59,365,128],[276.5,248.5],[247.5,225.5,186.5,184],[181,106.5,181,33],[181,10.5,167,-3.5],[153.5,-17.5,132,-17.5],[81.5,-17.5,81.5,50.5],[81.5,92,87,174.5],[93,257.5,93,299],[93,375,95,472.5],[97.5,570.5,97.5,645.5],[97.5,668,95,698.5],[93,729,93,751.5],[93,774,106.5,788],[120.5,802,142,802],[163.5,802,177,788],[191,774,191,751.5],[191,728.5,193.5,697],[196,666,196,643],[192.5,482],[190,395,191,308],[259,360,322,422],[432,535.5],[448.5,552.5,467.5,552.5],[487,552.5,502.5,537],[518.5,521.5,518.5,501],[518.5,484,504,467.5],[442.5,395.5,352.5,313],[461.5,164.5],[538,60,538,28.5],[538,8.5,522,-6],[506.5,-20.5,486,-20.5]]],
        sC                         : ['H±@¼ HW@¼H9AS G¨B8F¿CB ElE3 E1D¨D7D2 D,BºD,A§ D,AWC³A; Cv@ÂCJ@Â Bf@ÂBfB& BfB{BqCÂ B}EEB}E» B}G0B£Ht B¨J7B¨KM B¨K{B£L7 B}LuB}LÄ B}MNBºMk C3M©C_M© C¬M©D#Mk D@MND@LÄ D@LtDEL4 DJKwDJKH DCH© D>GXD@F* EHFµFFG± H!Ir HCI¶HjI¶ H³I¶I/Iu IOIUIOI, IOH­I2Hj H7GYF¦F4 H^C® IwB:IwA| IwASIVA6 I7@¼H±@¼'],
        xMin                       : 63,
        xMax                       : 542,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 537
      };
      csn["l"]                     = {
        xMin                       : 63,
        xMax                       : 177,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      csn["m"]                     = {
        sC                         : ["LC@p Kr@pKdAF KQB4K?C} JÀF2 J¶FxJ|G9 JYG¶J1G¶ I¯G¶I&GT HGF½H)Fx H(E¼H.E; HLC0 H`AµH`A+ H`@¢HC@c H(@FG~@F GR@FG6@c F¾@¢F¾A+ F¾B#F¥C³ FkE~FkFw FkGaFLG¾ E©G|E>G3 DHF/ D8EºC¸Eq C¸E4C­D? C¢CJC¢Bµ C¢BuC«B> CµA«CµAq CµAGCtA+ CU@²C,@² B;@²B;B³ B;CLBFDC BQE:BQEw BQF+BGF¸ B>G¢B>H5 B>I»C#I» CKI»ClIw C¯ITC¯I, C¯H¼CªHr C¥HIC¥H4 C§GK D8H6DÀH¯ E¥IdFIId GgIdGÄHG HXH³I#I4 IqIYJRIY KzIYL6H$ LBG¤L`E¯ L|DaM&AO M*A&L¯@® Lo@pLC@p"],
        xMin                       : 60,
        xMax                       : 754,
        yMin                       : -62,
        yMax                       : 555,
        width                      : 795
      };
      csn["n"]                     = {
        sC                         : ["HL@| Gw@|GlAY GOC4 GAD)GAD² GAE+GDEo GHF1GHFM GHH$FyH$ E«H$E!FÃ DFF&CµDo C³DGC¬C¯ C¦CZC¦C+ C¦B°C¬BQ C²A¸C²Ax C²AJCtA. CX@µC-@µ B¤@µBgA. BKAJBKAx BKA¸BDBQ B>B°B>C+ B>CµBLEH B[F¢B[Gg B[G©BWHE BTH§BTI# BTIOBqIk B°I©C7I© C¶I©C¿H§ CÂG² EGIpFyIp G»IpHWHc H¥G§H©FL H©Eh H¨D­ H¨D7H½C3 I0B0I0A_ I0A2H¶@¹ Hx@|HL@|"],
        xMin                       : 62,
        xMax                       : 503,
        yMin                       : -35,
        yMax                       : 546,
        width                      : 536
      };
      csn["o"]                     = {
        shapeCmds                  : [[[257,-29.5],[173,-29.5,112.5,32.5],[45,101.5,41.5,218],[38.5,331,98.5,417],[168.5,518.5,293.5,518.5],[393.5,518.5,445,427],[486,353,484.5,249],[483,138,426.5,59.5],[362.5,-29.5,257,-29.5]]],
        holeCmds                   : [[[[287,417],[213.5,417.5,172.5,347],[140,290.5,140,218],[140,145.5,179.5,105],[212.5,71.5,257,71.5],[309,71.5,346.5,109.5],[389,151.5,391.5,223],[398.5,416.5,287,417]]]],
        xMin                       : 41,
        xMax                       : 484,
        yMin                       : -29,
        yMax                       : 518,
        width                      : 538
      };
      csn["p"]                     = {
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      csn["q"]                     = {
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      csn["r"]                     = {
        xMin                       : 60,
        xMax                       : 363,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 352
      };
      csn["s"]                     = {
        sC                         : ['GqGD G9GDG"Gj F·G¦F¬HU F>HBE!G² C¤GOC£Fr CÁFgD;Fb EÄF8F´Eq H4DªH4C@ H4AÀG&AJ F2@©D¢@© C}@©B¨A2 AlAkAlBN AlBwA­B· B*C2BRC2 BrC2C!B¥ C:BlC±B] DQBPD¢BP ESBPE¶Be FqB¤FqC@ FqDHE2Dy DJD² CEE,B°ES B<E®B<F} B<HMC¤I% D=IAEAIg FEI¯F¡J% G&J8GWJ8 G¥J8GÀI¿ H9I£H9IS H9I6HEH¡ HRHFHRH) HRG}H6Ga G¾GDGqGD'],
        xMin                       : 20,
        xMax                       : 456,
        yMin                       : -30,
        yMax                       : 571,
        width                      : 498
      };
      csn["t"]                     = {
        sC                         : ["GkG¹ GUG¹G8G» F¿G½FªG½ FqG½E¢G® EµC< E¶B³ E·B^ E»@¥E+@¥ D¦@¥Df@¿ DHA6DHA^ DHA¦DKBO DNB¾DNCA D:G¬ CrG¯B]G½ A¦H%A¦H~ A¦I)AÁIF B9IdBdId D5IR D5I¨D0JZ D,K0D,KV D,K£DIK¾ DgL7D³L7 EkL7EzK# E}J¢E}JK E{I´ EzIS FvIdFªId GpIdG²IY HLIEHLH| HLHOH0H2 G¸G¹GkG¹"],
        xMin                       : 32,
        xMax                       : 453,
        yMin                       : -32,
        yMax                       : 698,
        width                      : 482
      };
      csn["u"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : -14,
        yMax                       : 517,
        width                      : 574
      };
      csn["v"]                     = {
        xMin                       : 9,
        xMax                       : 510,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 519
      };
      csn["w"]                     = {
        xMin                       : 13,
        xMax                       : 765,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 778
      };
      csn["x"]                     = {
        xMin                       : 4,
        xMax                       : 533,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 537
      };
      csn["y"]                     = {
        xMin                       : 3,
        xMax                       : 515,
        yMin                       : -205,
        yMax                       : 517,
        width                      : 519
      };
      csn["z"]                     = {
        sC                         : ["H©Gl H-F£G!E5 G!E5 E¤CIE6Bh EÂBmFnBm F·BmGbB^ H.BNHUBN H¤BNH¿B1 I8A¸I8Aj I8A<H¿@Ã H¤@§HU@§ H.@§Gb@¶ F·A!FnA! D¯A!CB@z C-@vBÀ@v B<@vB<AJ B<A}BoB* DtC¹G%G¬ EÄG¤EfG¤ DQG¤C5G» B]H$B]H| B]I&BxID BµIcC;Ic CmIcDOIV E2IKEfIK F)IKG1IT H9I_H~I_ IRI_IRH» IRHGH©Gl"],
        xMin                       : 61,
        xMax                       : 520,
        yMin                       : -38,
        yMax                       : 528,
        width                      : 551
      };
      csn[nbsp]                    = {
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 425
      };
      csn[" "]                     = csn[nbsp];

      return csn;
  };
  /* 
// https://opentype.js.org/glyph-inspector.html

function doGLYPH(){return makeD(GLYPH.getPath(0,0,1024))}

function makeD(path){
  var d  = "",lastX=NaN;lastY=NaN;
  path.commands.forEach(function(cmd){var parms=coordinates(cmd);if((cmd.type!=="L"&&cmd.type!=="l")||parms.length){ d+=" "+cmd.type+parms}});
  return d.slice(1);

  function coordinates(cmd){
    if(cmd.x2){
      lastX  = cmd.x;
      lastY  = cmd.y;
      return " "+(Math.floor(2*cmd.x1)/2)+" "+(Math.floor(0-2*cmd.y1)/2)+" "+(Math.floor(2*cmd.x2)/2)+" "+(Math.floor(0-2*cmd.y2)/2)+" "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
    }else{
      if(cmd.x1){
        lastX  = cmd.x;
        lastY  = cmd.y;
        return " "+(Math.floor(2*cmd.x1)/2)+" "+(Math.floor(0-2*cmd.y1)/2)+" "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
      }else{
        if(cmd.x&&!(lastX===cmd.x&&lastY===cmd.y)){
          lastX  = cmd.x;
          lastY  = cmd.y;
          return " "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
        }else{
          return ""
        }
      }
    }
  }
};
 */


  //  JURA-MEDIUM  JURA-MEDIUM  JURA-MEDIUM  JURA-MEDIUM  JURA-MEDIUM  JURA-MEDIUM 
  //
  //
  JUR                            = function(codeList){

      var jur={reverseHoles:true,reverseShapes:false},nbsp="\u00A0";
      jur["A"]                     = {
        // shapeCmds                  : [[[346,636],[264,636],[27,37],[25,31,24,24,24,18],[24,-9,51,-16,60,-16],[75,-16,89,-6,97,12],[166,189],[444,189],[513,12],[518,-1,532,-16,550,-16],[560,-16,586,-9,586,18],[586,24,585,31,583,37]]],
        sC                         : ['FwK: ERK: AyA¯ AuA£AsAsAsAg AsA0B(A!B:A! BXA!BuA6B§AZ C±D< H:D< IDAZ INA@IkA!I±A! J!A!JVA0JVAg JVAsJTA£JPA¯'],
        // holeCmds                   : [[[[195,261],[304,532],[415,261]]]],
        hC                         : [['DHEL F!Ik G£EL']],
        xMin                       : 24,
        xMax                       : 586,
        yMin                       : -16,
        yMax                       : 532,
        width                      : 610
      };
      jur["B"]                     = {
        // shapeCmds                  : [[[84,44],[84,22,91,0,118,0],[336,0],[502,0,588,30,588,184],[588,203],[588,296,556,341,506,366],[534,392,546,431,546,475],[546,605,457,636,306,636],[118,636],[104,636,84,630,84,592]]],
        sC                         : ['BkA½ BkAoByABC.AB FcAB I.ABJZA¡JZD2 JZDX JZEµI½FmI6FÁ IoGRI©GÃI©Hy I©J}HTK:F%K: C.K: BµK:BkK.BkJc'],
        // holeCmds                   : [[[[354,312],[475,312,516,302,516,200],[516,184],[516,83,475,72,336,72],[156,72],[156,312]],[[306,384],[156,384],[156,559],[306,559],[429,559,474,546,474,472],[474,398,431,384,306,384]]]],
        hC                         : [['F©F2 HyF2IJEÁIJDR IJD2 IJBiHyBRFcBR C{BR C{F2','F%GB C{GB C{IÃ F%IÃ G¿IÃHwI©HwHs HwG_GÃGBF%GB']],
        xMin                       : 84,
        xMax                       : 588,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 644
      };
      jur["C"]                     = {
        // shapeCmds                  : [[[465,0],[561,0,575,62,575,121],[575,154,561,167,539,167],[525,167,503,159,503,124],[503,84,494,72,458,72],[324,72],[183,72,143,82,143,186],[143,450],[143,554,185,564,306,564],[458,564],[494,564,503,552,503,512],[503,477,525,469,539,469],[553,469,575,475,575,514],[575,574,561,636,465,636],[306,636],[158,636,71,606,71,452],[71,184],[71,30,157,0,324,0]]],
        sC                         : ['HeAB J#ABJ@B>J@C4 J@CwJ#C³IyC³ I]C³I0C£I0C: I0BkHÁBRHVBR FJBR D0BRCaBgCaD6 CaHF CaI¹D4J*F%J* HVJ* HÁJ*I0IµI0IB I0H}I]HmIyHm I·HmJ@HyJ@IF J@J>J#K:HeK: F%K: C¡K:BPJ¡BPHJ BPD2 BPA¡C}ABFJAB'],
        xMin                       : 71,
        xMax                       : 575,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 631
      };
      jur["D"]                     = {
        // shapeCmds                  : [[[588,452],[588,606,501,636,354,636],[118,636],[104,636,84,630,84,592],[84,44],[84,22,91,0,118,0],[336,0],[502,0,588,30,588,184]]],
        sC                         : ['JZHJ JZJ¡I,K:F©K: C.K: BµK:BkK.BkJc BkA½ BkAoByABC.AB FcAB I.ABJZA¡JZD2'],
        // holeCmds                   : [[[[516,186],[516,82,476,72,336,72],[156,72],[156,564],[354,564],[475,564,516,554,516,450]]]],
        hC                         : [['IJD6 IJBgH{BRFcBR C{BR C{J* F©J* HyJ*IJI¹IJHF']],
        xMin                       : 84,
        xMax                       : 588,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 659
      };
      jur["E"]                     = {
        // fullPath                   : "M 156 322 L 421 322 C 449 322 471 329 471 356 C 471 378 457 394 421 394 L 156 394 L 156 564 L 544 564 C 569 564 588 571 588 598 C 588 620 575 636 544 636 L 118 636 C 104 636 84 630 84 592 L 84 44 C 84 12 98 0 118 0 L 544 0 C 569 0 588 7 588 34 C 588 56 575 72 544 72 L 156 72 Z",
        // shapeCmds                  : [[[156,322],[421,322],[449,322,471,329,471,356],[471,378,457,394,421,394],[156,394],[156,564],[544,564],[569,564,588,571,588,598],[588,620,575,636,544,636],[118,636],[104,636,84,630,84,592],[84,44],[84,12,98,0,118,0],[544,0],[569,0,588,7,588,34],[588,56,575,72,544,72],[156,72]]],
        sC                         : ['C{FF G¯FF HDFFHqFTHqF­ HqG6HTGVG¯GV C{GV C{J* I¥J* J4J*JZJ8JZJo JZJ½J@K:I¥K: C.K: BµK:BkK.BkJc BkA½ BkAZB©ABC.AB I¥AB J4ABJZAPJZA© JZB2J@BRI¥BR C{BR'],
        xMin                       : 84,
        xMax                       : 588,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 636
      };
      jur["F"]                     = {
        // shapeCmds                  : [[[156,322],[421,322],[449,322,471,329,471,356],[471,378,457,394,421,394],[156,394],[156,564],[544,564],[569,564,588,571,588,598],[588,620,575,636,544,636],[118,636],[104,636,84,630,84,592],[84,36],[84,14,92,-7,120,-7],[145,-7,156,9,156,35]]],
        sC                         : ['C{FF G¯FF HDFFHqFTHqF­ HqG6HTGVG¯GV C{GV C{J* I¥J* J4J*JZJ8JZJo JZJ½J@K:I¥K: C.K: BµK:BkK.BkJc BkA­ BkA_B{A4C2A4 CeA4C{ATC{A«'],
        xMin                       : 84,
        xMax                       : 588,
        yMin                       : -7,
        yMax                       : 636,
        width                      : 615
      };
      jur["G"]                     = {
        // fullPath                   : "M 503 236 L 503 120 C 503 82 494 72 458 72 L 306 72 C 184 72 143 82 143 184 L 143 452 C 143 553 184 564 324 564 L 458 564 C 494 564 503 553 503 513 C 503 482 518 469 539 469 C 561 469 575 482 575 515 C 575 574 561 636 465 636 L 324 636 C 159 636 71 609 71 455 L 71 181 C 71 29 157 0 306 0 L 465 0 C 561 0 575 59 575 115 L 575 308 L 376 308 C 346 308 326 300 326 271 C 326 250 342 236 376 236 Z",
        // shapeCmds                  : [[[503,236],[503,120],[503,82,494,72,458,72],[306,72],[184,72,143,82,143,184],[143,452],[143,553,184,564,324,564],[458,564],[494,564,503,553,503,513],[503,482,518,469,539,469],[561,469,575,482,575,515],[575,574,561,636,465,636],[324,636],[159,636,71,609,71,455],[71,181],[71,29,157,0,306,0],[465,0],[561,0,575,59,575,115],[575,308],[376,308],[346,308,326,300,326,271],[326,250,342,236,376,236]]],
        sC                         : ['I0D½ I0C2 I0BgHÁBRHVBR F%BR D2BRCaBgCaD2 CaHJ CaI·D2J*FJJ* HVJ* HÁJ*I0I·I0ID I0H©INHmIyHm J#HmJ@H©J@IH J@J>J#K:HeK: FJK: C£K:BPJ§BPHP BPD, BPA}C}ABF%AB HeAB J#ABJ@B8J@C( J@F* G2F* FwF*FNE½FNEa FNE6FoD½G2D½'],
        xMin                       : 71,
        xMax                       : 575,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 645
      };
      jur["H"]                     = {
        // fullPath                   : "M 156 35 L 156 307 L 516 307 L 516 35 C 516 2 535 -7 553 -7 C 581 -7 588 14 588 35 L 588 600 C 588 632 572 643 551 643 C 523 643 516 621 516 600 L 516 379 L 156 379 L 156 600 C 156 623 146 643 118 643 C 104 643 84 637 84 600 L 84 35 C 84 -2 107 -7 120 -7 C 145 -7 156 9 156 35 Z",
        // shapeCmds                  : [[[156,307],[516,307],[516,35],[516,2,535,-7,553,-7],[581,-7,588,14,588,35],[588,600],[588,632,572,643,551,643],[523,643,516,621,516,600],[516,379],[156,379],[156,600],[156,623,146,643,118,643],[104,643,84,637,84,600],[84,35],[84,-2,107,-7,120,-7],[145,-7,156,9,156,35]]],
        sC                         : ['C{F( IJF( IJA« IJAFIqA4I·A4 JLA4JZA_JZA« JZJs JZK2J:KHI³KH IXKHIJJ¿IJJs IJG8 C{G8 C{Js C{JÃCgKHC.KH BµKHBkK<BkJs BkA« BkA>B»A4C2A4 CeA4C{ATC{A«'],
        xMin                       : 84,
        xMax                       : 588,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 672
      };
      jur["I"]                     = {
        // fullPath                   : "M 156 33 L 156 602 C 156 636 134 643 120 643 C 106 643 84 636 84 602 L 84 33 C 84 0 105 -7 119 -7 C 148 -7 156 14 156 33 Z",
        // shapeCmds                  : [[[84,33],[84,0,105,-7,119,-7],[148,-7,156,14,156,33],[156,602],[156,636,134,643,120,643],[106,643,84,636,84,602],[84,33],[84,0,105,-7,119,-7],[148,-7,156,14,156,33]]],
        sC                         : ['BkA§ BkABB·A4C0A4 CkA4C{A_C{A§ C{Jw C{K:CNKHC2KH B¹KHBkK:BkJw BkA§ BkABB·A4C0A4 CkA4C{A_C{A§'],
        xMin                       : 84,
        xMax                       : 156,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 240
      };
      jur["J"]                     = {
        // fullPath                   : "M 272 64 C 146 64 106 75 106 182 C 106 207 92 225 71 225 C 47 225 33 209 33 182 C 33 21 120 -8 272 -8 C 424 -8 510 21 510 173 L 510 602 C 510 636 488 643 474 643 C 458 643 438 634 438 603 L 438 176 C 438 75 397 64 272 64 Z",
        // shapeCmds                  : [[[438,176],[438,75,397,64,272,64],[146,64,106,75,106,182],[106,207,92,225,71,225],[47,225,33,209,33,182],[33,21,120,-8,272,-8],[424,-8,510,21,510,173],[510,602],[510,636,488,643,474,643],[458,643,438,634,438,603]]],
        sC                         : ['H.D! H.BXG]BBEcBB CgBBB¹BXB¹D. B¹DaB{D§BPD§ AÃD§A§DeA§D. A§AmC2A2EcA2 GµA2I>AmI>C¿ I>Jw I>K:HµKHHwKH HVKHH.K6H.Jy'],
        xMin                       : 33,
        xMax                       : 510,
        yMin                       : -8,
        yMax                       : 643,
        width                      : 591
      };
      jur["K"]                     = {
        // fullPath                   : "M 554 27 C 554 38 548 47 541 55 L 251 354 L 475 581 C 486 594 487 607 487 610 C 487 630 468 643 452 643 C 438 643 428 634 419 624 L 156 346 L 156 600 C 156 635 134 643 120 643 C 106 643 84 636 84 602 L 84 33 C 84 0 105 -7 119 -7 C 136 -7 156 1 156 35 L 156 264 L 199 316 L 485 12 C 494 1 504 -7 518 -7 C 532 -7 554 7 554 27 Z",
        // shapeCmds                  : [[[554,27],[554,38,548,47,541,55],[251,354],[475,581],[486,594,487,607,487,610],[487,630,468,643,452,643],[438,643,428,634,419,624],[156,346],[156,600],[156,635,134,643,120,643],[106,643,84,636,84,602],[84,33],[84,0,105,-7,119,-7],[136,-7,156,1,156,35],[156,264],[199,316],[485,12],[494,1,504,-7,518,-7],[532,-7,554,7,554,27]]],
        sC                         : ['I¹Ay I¹A±I­AÃI}B0 E8F© HyJL H±JgH³J£H³J© H³K.HkKHHJKH H.KHG½K6G«K! C{Fw C{Js C{K8CNKHC2KH B¹KHBkK:BkJw BkA§ BkABB·A4C0A4 CRA4C{ADC{A« C{ER DPF: H¯AZ HÁADI2A4INA4 IkA4I¹API¹Ay'],
        xMin                       : 84,
        xMax                       : 554,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 560
      };
      jur["L"]                     = {
        // fullPath                   : "M 118 0 L 489 0 C 525 0 532 21 532 35 C 532 55 520 72 489 72 L 156 72 L 156 603 C 156 634 136 643 120 643 C 104 643 84 634 84 603 L 84 43 C 84 6 104 0 118 0 Z",
        // shapeCmds                  : [[[489,0],[525,0,532,21,532,35],[532,55,520,72,489,72],[156,72],[156,603],[156,634,136,643,120,643],[104,643,84,634,84,603],[84,43],[84,6,104,0,118,0]]],
        sC                         : ['H·AB I]ABIkAmIkA« IkB0IRBRH·BR C{BR C{Jy C{K6CRKHC2KH BµKHBkK6BkJy BkA» BkANBµABC.AB'],
        xMin                       : 50,
        xMax                       : 440,
        yMin                       : 0,
        yMax                       : 755,
        width                      : 474
      };
      jur["M"]                     = {
        // fullPath                   : "M 346 279 C 363 279 372 289 374 291 L 537 523 L 537 38 C 537 6 551 -7 572 -7 C 593 -7 609 5 609 35 L 609 600 C 609 631 595 643 574 643 C 559 643 547 634 537 620 L 346 354 L 156 620 C 145 636 133 643 118 643 C 104 643 84 637 84 600 L 84 35 C 84 -2 107 -7 120 -7 C 149 -7 156 15 156 38 L 156 523 L 319 291 C 322 288 330 279 346 279 Z",
        // shapeCmds                  : [[[319,291],[322,288,330,279,346,279],[363,279,372,289,374,291],[537,523],[537,38],[537,6,551,-7,572,-7],[593,-7,609,5,609,35],[609,600],[609,631,595,643,574,643],[559,643,547,634,537,620],[346,354],[156,620],[145,636,133,643,118,643],[104,643,84,637,84,600],[84,35],[84,-2,107,-7,120,-7],[149,-7,156,15,156,38],[156,523]]],
        sC                         : ['F@E« FFE¥FVEqFwEq F»EqG*E§G.E« IuIX IuA± IuANI³A4J:A4 JeA4J§ALJ§A« J§Js J§K0JiKHJ>KH IÃKHI«K6IuJ½ FwF© C{J½ CeK:CLKHC.KH BµKHBkK<BkJs BkA« BkA>B»A4C2A4 CmA4C{AaC{A± C{IX'],
        xMin                       : 84,
        xMax                       : 609,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 693
      };
      jur["N"]                     = {
        fullPath                   : "M 553 -7 C 581 -7 588 14 588 35 L 588 600 C 588 632 572 643 551 643 C 537 643 516 636 516 597 L 516 118 L 156 620 C 145 636 133 643 118 643 C 104 643 84 637 84 600 L 84 35 C 84 -2 107 -7 120 -7 C 149 -7 156 11 156 32 L 156 517 L 525 0 C 528 -4 540 -7 553 -7 Z",
        shapeCmds                  : [[[525,0],[528,-4,540,-7,553,-7],[581,-7,588,14,588,35],[588,600],[588,632,572,643,551,643],[537,643,516,636,516,597],[516,118],[156,620],[145,636,133,643,118,643],[104,643,84,637,84,600],[84,35],[84,-2,107,-7,120,-7],[149,-7,156,11,156,32],[156,517]]],
        xMin                       : 71,
        xMax                       : 650,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      jur["O"]                     = {
        shapeCmds                  : [[[568,406],[568,557,464,645,316,645],[167,645,64,557,64,406],[64,230],[64,79,167,-9,316,-9],[464,-9,568,79,568,230]]],
        holeCmds                   : [[[[496,233],[496,125,435,63,316,63],[197,63,136,125,136,233],[136,403],[136,509,195,573,316,573],[437,573,496,509,496,403]]]],
        xMin                       : 64,
        xMax                       : 568,
        yMin                       : -9,
        yMax                       : 645,
        width                      : 632
      };
      jur["S"]                     = {
        // shapeCmds                  : [[[344,572],[486,572,524,563,524,456],[524,431,538,413,560,413],[575,413,597,422,597,456],[597,617,508,644,344,644],[268,644],[103,644,61,555,61,478],[61,387,98,336,200,316],[473,265],[488,261,525,231,525,163],[525,128,508,64,430,64],[312,64],[173,64,134,75,134,182],[134,207,120,225,99,225],[75,225,61,209,61,182],[61,20,152,-8,312,-8],[408,-8],[556,-8,597,81,597,160],[597,236,566,316,460,336],[185,385],[157,392,133,428,133,475],[133,509,151,572,238,572]]],
        sC                         : ['FsJ: H±J:IZJ(IZHR IZGÃIwG}J!G} J@G}JmG±JmHR JmJ·I:KJFsKJ EZKJ B³KJB<I»B<H¡ B<GHB©FcDRF: HuET HµELI]D³I]C« I]CBI:BBGÁBB F2BB C¿BBCNBXCND. CNDaC2D§B«D§ BXD§B<DeB<D. B<AkCsA2F2A2 GsA2 I½A2JmBeJmC¥ JmD½J.F:HZFc D4GD C}GRCLG½CLHy CLI<CqJ:DÁJ:'],
        xMin                       : 61,
        xMax                       : 597,
        yMin                       : -8,
        yMax                       : 644,
        width                      : 658
      };
      jur["T"]                     = {
        fullPath                   : "M 450 636 L 69 636 C 34 636 26 614 26 600 C 26 586 34 564 69 564 L 219 564 L 219 33 C 219 1 242 -7 259 -7 C 276 -7 302 1 302 33 L 302 564 L 450 564 C 486 564 493 585 493 599 C 493 619 481 636 450 636 Z",
        shapeCmds                  : [[[69,636],[34,636,26,614,26,600],[26,586,34,564,69,564],[219,564],[219,33],[219,1,242,-7,259,-7],[276,-7,302,1,302,33],[302,564],[450,564],[486,564,493,585,493,599],[493,619,481,636,450,636]]],
        xMin                       : 26,
        xMax                       : 493,
        yMin                       : -7,
        yMax                       : 636,
        width                      : 520
      };
      jur["X"]                     = {
        // fullPath                   : "M 530 643 C 515 643 505 632 497 621 L 302 365 L 108 621 C 101 631 91 643 74 643 C 66 643 39 637 39 607 C 39 603 40 593 49 582 L 254 317 L 49 53 C 41 43 39 34 39 26 C 39 5 59 -7 74 -7 C 88 -7 100 2 108 13 L 302 270 L 497 13 C 504 4 514 -7 530 -7 C 545 -7 566 3 566 26 C 566 34 564 43 556 53 L 351 317 L 556 582 C 565 594 566 603 566 607 C 566 636 541 643 530 643 Z",
        // shapeCmds                  : [[[302,365],[108,621],[101,631,91,643,74,643],[66,643,39,637,39,607],[39,603,40,593,49,582],[254,317],[49,53],[41,43,39,34,39,26],[39,5,59,-7,74,-7],[88,-7,100,2,108,13],[302,270],[497,13],[504,4,514,-7,530,-7],[545,-7,566,3,566,26],[566,34,564,43,556,53],[351,317],[556,582],[565,594,566,603,566,607],[566,636,541,643,530,643],[515,643,505,632,497,621]]],
        sC                         : ['EÁF¿ B½J¿ B¯K0ByKHBVKH BFKHA³K<A³J£ A³JyAµJeB#JN E>F< B#B, A·A»A³A©A³Aw A³ALB8A4BVA4 BsA4B­AFB½A] EÁE_ I#A] I2AJIFA4IgA4 I§A4J.AHJ.Aw J.A©J*A»I½B, F£F< I½JN J,JgJ.JyJ.J£ J.K:I}KHIgKH IHKHI4K2I#J¿'],
        xMin                       : 39,
        xMax                       : 566,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 605
      };
      jur["Y"]                     = {
        fullPath                   : "M 243 306 L 243 32 C 243 2 263 -7 281 -7 C 313 -7 320 15 320 32 L 320 306 L 534 583 C 538 590 544 598 544 609 C 544 630 523 643 509 643 C 500 643 489 638 475 621 L 281 365 L 86 621 C 78 632 68 643 53 643 C 37 643 18 629 18 609 C 18 598 24 590 28 583 Z",
        shapeCmds                  : [[[243,306],[243,32],[243,2,263,-7,281,-7],[313,-7,320,15,320,32],[320,306],[534,583],[538,590,544,598,544,609],[544,630,523,643,509,643],[500,643,489,638,475,621],[281,365],[86,621],[78,632,68,643,53,643],[37,643,18,629,18,609],[18,598,24,590,28,583]]],
        xMin                       : 18,
        xMax                       : 544,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 563
      };
      jur["Z"]                     = {
        fullPath                   : "M 50 0 L 508 0 C 547 0 553 21 553 35 C 553 65 533 72 508 72 L 144 72 L 553 569 L 553 636 L 95 636 C 62 636 49 622 49 600 C 49 571 69 564 95 564 L 461 564 L 50 64 Z",
        shapeCmds                  : [[[50,0],[508,0],[547,0,553,21,553,35],[553,65,533,72,508,72],[144,72],[553,569],[553,636],[95,636],[62,636,49,622,49,600],[49,571,69,564,95,564],[461,564],[50,64]]],
        xMin                       : 49,
        xMax                       : 553,
        yMin                       : 0,
        yMax                       : 636,
        width                      : 602
      };
      jur["a"]                     = {
        shapeCmds                  : [[[314,305],[150,305,61,273,61,129],[61,49,111,0,178,0],[271,0],[343,0,409,15,451,50],[451,38],[451,-1,473,-7,487,-7],[500,-7,523,-2,523,35],[523,331],[523,420,501,461,413,461],[258,461],[141,461,61,439,61,350],[61,312,82,305,96,305],[126,305,133,325,133,350],[133,379,158,389,265,389],[406,389],[442,389,451,380,451,347],[451,305]]],
        holeCmds                   : [[[[451,233],[451,167,436,72,271,72],[178,72],[159,72,133,95,133,124],[133,223,171,233,314,233]]]],
        xMin                       : 61,
        xMax                       : 523,
        yMin                       : -7,
        yMax                       : 461,
        width                      : 594
      };
      jur["b"]                     = {
        shapeCmds                  : [[[147,597],[147,630,131,643,109,643],[89,643,75,630,75,597],[75,35],[75,-2,98,-7,111,-7],[140,-7,147,15,147,38],[147,50],[189,16,255,0,328,0],[357,0],[523,0,609,30,609,178],[609,283],[609,431,523,461,357,461],[328,461],[255,461,189,445,147,411]]],
        holeCmds                   : [[[[357,389],[497,389,537,380,537,280],[537,181],[537,81,497,72,357,72],[328,72],[181,72,147,146,147,228],[147,232],[147,315,181,389,328,389]]]],
        xMin                       : 75,
        xMax                       : 609,
        yMin                       : 0,
        yMax                       : 643,
        width                      : 670
      };
      jur["c"]                     = {
        shapeCmds                  : [[[455,0],[551,0,565,62,565,121],[565,154,551,167,529,167],[515,167,493,159,493,124],[493,84,484,72,448,72],[314,72],[171,72,133,82,133,181],[133,280],[133,379,171,389,314,389],[448,389],[484,389,493,377,493,337],[493,302,515,294,529,294],[543,294,565,300,565,339],[565,398,551,461,455,461],[314,461],[147,461,61,431,61,283],[61,178],[61,30,147,0,314,0]]],
        xMin                       : 61,
        xMax                       : 565,
        yMin                       : 0,
        yMax                       : 461,
        width                      : 624
      };
      jur["d"]                     = {
        shapeCmds                  : [[[61,178],[61,30,147,0,313,0],[342,0],[415,0,481,16,523,50],[523,38],[523,15,530,-7,559,-7],[572,-7,595,-2,595,35],[595,598],[595,620,588,643,561,643],[547,643,523,638,523,598],[523,461],[305,461],[147,461,61,431,61,283]]],
        holeCmds                   : [[[[133,280],[133,380,173,389,305,389],[523,389],[523,229],[523,146,489,72,342,72],[313,72],[173,72,133,81,133,181]]]],
        xMin                       : 61,
        xMax                       : 595,
        yMin                       : -7,
        yMax                       : 643,
        width                      : 670
      };
      jur["e"]                     = {
        shapeCmds                  : [[[595,283],[595,431,509,461,343,461],[314,461],[147,461,61,431,61,283],[61,178],[61,30,147,0,314,0],[475,0],[571,0,585,62,585,121],[585,154,571,167,549,167],[535,167,513,159,513,124],[513,84,504,72,468,72],[314,72],[171,72,133,82,133,181],[133,235],[595,235]]],
        holeCmds                   : [[[[343,389],[473,389,518,381,523,307],[133,307],[137,377,173,389,314,389]]]],
        xMin                       : 61,
        xMax                       : 595,
        yMin                       : 0,
        yMax                       : 461,
        width                      : 651
      };
      jur["f"]                     = {
        xMin                       : 9,
        xMax                       : 317,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 315
      };
      jur["g"]                     = {
        shapeCmds                  : [[[595,426],[595,463,572,468,559,468],[530,468,523,446,523,423],[523,411],[481,445,415,461,342,461],[313,461],[147,461,61,431,61,283],[61,178],[61,30,147,0,311,0],[523,0],[523,-93],[523,-126,518,-133,487,-133],[178,-133],[142,-133,133,-121,133,-81],[133,-50,119,-38,97,-38],[83,-38,61,-44,61,-83],[61,-142,75,-205,171,-205],[494,-205],[575,-205,595,-164,595,-77]]],
        sC                         : ['JiG¹ JiHaJ:HkIÃHk IgHkIXH>IXG³ IXGy H§H<G£H]FoH] F4H] CiH]B<GÃB<Ey B<D% B<A¡CiABF0AB IXAB IX?« IX?FIN?8H³?8 D%?8 C_?8CL?PCL?Ã CL@_C0@wB§@w Bi@wB<@kB<?¿ B<?%BX>(C»>( HÁ>( J@>(Ji>{Ji@('],
        holeCmds                   : [[[[311,72],[173,72,133,81,133,181],[133,280],[133,380,173,389,313,389],[342,389],[489,389,523,315,523,233],[523,72]]]],
        hC                         : ['F0BR C¿BRCLBeCLD, CLEs CLG:C¿GLF4GL FoGL H·GLIXF8IXD· IXBR'],
        xMin                       : 61,
        xMax                       : 595,
        yMin                       : -205,
        yMax                       : 468,
        width                      : 670
      };
      jur["h"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      jur["i"]                     = {
        shapeCmds                  : [[[73,20],[73,-14,94,-22,108,-22],[137,-22,145,-1,145,20],[145,440],[145,475,123,483,109,483],[95,483,73,475,73,440]],[[109,550],[133,550,170,570,170,601],[170,633,132,652,109,652],[82,652,48,632,48,601],[48,569,86,550,108,551]]],
        xMin                       : 48,
        xMax                       : 170,
        yMin                       : -22,
        yMax                       : 652,
        width                      : 218
      };
      jur["j"]                     = {
        shapeCmds                  : [[[111,550],[135,550,172,570,172,601],[172,633,134,652,111,652],[84,652,50,632,50,601],[50,569,88,550,111,550]],[[147,422],[147,446,140,468,112,468],[82,468,75,446,75,422],[75,0],[75,-93,37,-103,-76,-103],[-101,-103,-122,-111,-122,-138],[-122,-160,-109,-175,-76,-175],[59,-175,147,-151,147,0]]],
        xMin                       : -122,
        xMax                       : 172,
        yMin                       : -175,
        yMax                       : 652,
        width                      : 222
      };
      jur["k"]                     = {
        xMin                       : 63,
        xMax                       : 542,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 537
      };
      jur["l"]                     = {
        xMin                       : 63,
        xMax                       : 177,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      jur["m"]                     = {
        xMin                       : 60,
        xMax                       : 810,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 870
      };
      jur["n"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 574
      };
      jur["o"]                     = {
        shapeCmds                  : [[[343,0],[509,0,595,30,595,178],[595,283],[595,431,509,461,343,461],[314,461],[147,461,61,431,61,283],[61,178],[61,30,147,0,314,0]]],
        holeCmds                   : [[[[314,72],[171,72,133,82,133,181],[133,280],[133,379,171,389,314,389],[343,389],[483,389,523,380,523,280],[523,181],[523,81,483,72,343,72]]]],
        xMin                       : 61,
        xMax                       : 595,
        yMin                       : 0,
        yMax                       : 461,
        width                      : 656
      };
      jur["p"]                     = {
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      jur["q"]                     = {
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      jur["r"]                     = {
        shapeCmds                  : [[[297,389],[343,389],[364,389,388,396,388,425],[388,447,375,461,343,461],[297,461],[241,461,187,445,146,411],[146,422],[146,454,130,468,108,468],[94,468,74,462,74,425],[74,35],[74,-2,97,-7,110,-7],[135,-7,146,9,146,35],[146,229],[146,332,197,389,297,389]]],
        xMin                       : 74,
        xMax                       : 388,
        yMin                       : -7,
        yMax                       : 468,
        width                      : 406
      };
      jur["s"]                     = {
        xMin                       : 32,
        xMax                       : 492,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 519
      };
      jur["t"]                     = {
        shapeCmds                  : [[[152,181],[152,389],[280,389],[320,389,326,409,326,423],[326,445,312,461,280,461],[152,461],[152,555],[152,588,136,601,114,601],[94,601,80,588,80,555],[80,460],[61,457,49,447,49,429],[49,409,60,397,80,394],[80,178],[80,31,166,0,303,0],[343,0,348,24,348,38],[348,65,325,72,303,72],[194,72,152,81,152,181]]],
        xMin                       : 49,
        xMax                       : 348,
        yMin                       : 0,
        yMax                       : 601,
        width                      : 373
      };
      jur["u"]                     = {
        shapeCmds                  : [[[351,72],[322,72],[182,72,142,81,142,181],[142,426],[142,459,123,468,105,468],[77,468,70,447,70,426],[70,178],[70,30,156,0,322,0],[351,0],[424,0,490,16,532,50],[532,39],[532,6,548,-7,570,-7],[584,-7,604,-1,604,36],[604,426],[604,463,581,468,568,468],[543,468,532,452,532,426],[532,232],[528,153,502,72,351,72]]],
        xMin                       : 70,
        xMax                       : 604,
        yMin                       : -7,
        yMax                       : 468,
        width                      : 678
      };
      jur["v"]                     = {
        xMin                       : 9,
        xMax                       : 510,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 519
      };
      jur["w"]                     = {
        xMin                       : 13,
        xMax                       : 765,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 778
      };
      jur["x"]                     = {
        xMin                       : 4,
        xMax                       : 533,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 537
      };
      jur["y"]                     = {
        // shapeCmds                  : [[[604,-77],[604,426],[604,463,581,468,568,468],[543,468,532,452,532,426],[532,232],[532,153,502,72,351,72],[322,72],[182,72,142,81,142,181],[142,426],[142,459,123,468,105,468],[77,468,70,447,70,426],[70,178],[70,30,156,0,322,0],[351,0],[424,0,490,16,532,50],[532,-93],[532,-126,527,-133,496,-133],[187,-133],[151,-133,142,-121,142,-81],[142,-50,128,-38,106,-38],[92,-38,70,-44,70,-83],[70,-142,84,-205,180,-205],[503,-205],[584,-205,604,-164,604,-77]]],
        sC                         : ['J{@( J{G¹ J{HaJLHkJ2Hk I£HkIkHJIkG¹ IkDµ IkCuI.BRF£BR FFBR D.BRC_BeC_D, C_G¹ C_HXC8HkB·Hk B]HkBNH@BNG¹ BND% BNA¡C{ABFFAB F£AB GµABH¹AcIkB% Ik?« Ik?FIa?8I!?8 D8?8 Cq?8C_?PC_?Ã C_@_CB@wB¹@w B{@wBN@kBN?¿ BN?%Bk>(D*>( I0>( JR>(J{>{J{@('],
        xMin                       : 70,
        xMax                       : 604,
        yMin                       : -205,
        yMax                       : 468,
        width                      : 679
      };
      jur["z"]                     = {
        shapeCmds                  : [[[162,72],[521,384],[521,461],[170,461],[82,461,60,418,60,322],[60,283,81,276,95,276],[124,276,132,294,132,322],[132,373,138,389,177,389],[422,389],[60,74],[60,0],[432,0],[520,0,542,45,542,139],[542,179,519,185,506,185],[484,185,470,172,470,139],[470,95,467,72,424,72]]],
        xMin                       : 60,
        xMax                       : 542,
        yMin                       : 0,
        yMax                       : 461,
        width                      : 594
      };
      jur["0"]                     = {
        // shapeCmds                  : [[[580,158],[580,478],[580,575,498,641,386,641],[270,641],[158,641,76,575,76,478],[76,158],[76,61,158,-5,270,-5],[386,-5],[498,-5,580,61,580,158]]],
        sC                         : ['JJC¡ JJH¡ JJJ@I%KDGFKD E_KD C¡KDBZJ@BZH¡ BZC¡ BZB<C¡A8E_A8 GFA8 I%A8JJB<JJC¡'],
        // holeCmds                   : [[[[148,491],[148,524,190,568,259,568],[397,568],[466,568,508,524,508,491],[508,144],[508,111,466,67,397,67],[259,67],[190,67,148,111,148,144]]]],
        hC                         : [['CkH» CkIZD>J2EHJ2 G]J2 HgJ2I:IZI:H» I:Cc I:BÃHgBHG]BH EHBH D>BHCkBÃCkCc']],
        xMin                       : 76,
        xMax                       : 580,
        yMin                       : -5,
        yMax                       : 641,
        width                      : 656
      };
      jur["1"]                     = {
        // shapeCmds                  : [[[116,569],[116,33],[116,14,124,-7,152,-7],[180,-7,188,14,188,33],[188,647],[188,676,163,685,151,685],[137,685,127,679,117,670],[56,610],[39,594,38,583,38,576],[38,566,45,546,72,546],[82,546,95,550,108,562]]],
        sC                         : ['C*J4 C*A§ C*A_C:A4CsA4 D*A4D:A_D:A§ D:KP D:K­C«K¿CqK¿ CTK¿C@K³C,K¡ B2J© A³JgA±JPA±JB A±J.A¿I©BRI© BgI©B£I±B½J%'],
        xMin                       : 38,
        xMax                       : 188,
        yMin                       : -7,
        yMax                       : 685,
        width                      : 276
      };
      jur["2"]                     = {
        // shapeCmds                  : [[[567,456],[567,611,481,641,333,641],[173,641],[99,641,64,608,64,519],[64,481,85,474,99,474],[129,474,136,494,136,519],[136,559,145,569,180,569],[333,569],[453,569,495,559,495,454],[495,315,64,306,64,52],[64,-5],[522,-5],[561,-5,567,16,567,30],[567,60,547,67,522,67],[136,67],[155,261,567,276,567,456]]],
        sC                         : ['J0HR J0J«H§KDF]KD C¿KD B«KDBBJ¥BBIP BBH§BmHwB«Hw CDHwCRHÁCRIP CRIÃCeJ4D*J4 F]J4 HLJ4HÃIÃHÃHN HÃF8BBF%BBB* BBA8 IVA8 J#A8J0AcJ0A¡ J0B:I«BHIVBH CRBH CyELJ0EkJ0HR'],
        xMin                       : 64,
        xMax                       : 567,
        yMin                       : -5,
        yMax                       : 641,
        width                      : 629
      };
      jur["3"]                     = {
        // shapeCmds                  : [[[360,569],[471,569,495,528,495,466],[495,403,387,362,309,362],[278,362,256,355,256,326],[256,297,277,289,309,289],[381,289,495,236,495,172],[495,109,471,67,360,67],[268,67],[199,67,134,92,134,119],[134,150,120,162,98,162],[76,162,62,149,62,116],[62,54,134,-5,261,-5],[347,-5],[507,-5,566,49,566,189],[566,238,499,301,453,326],[498,348,566,399,566,447],[566,587,507,641,347,641],[261,641],[134,641,62,582,62,519],[62,480,84,474,98,474],[120,474,134,486,134,517],[134,544,201,569,268,569]]],
        sC                         : ['FµJ4 HqJ4HÃIcHÃHg HÃGiGHF¹F,F¹ EoF¹EBF«EBFN EBE·EmE§F,E§ G<E§HÃD½HÃC½ HÃB¿HqBHFµBH EZBH DPBHCNB{CNC0 CNCoC2C©B©C© BZC©B>CmB>C* B>B.CNA8ELA8 FyA8 I8A8J.B#J.D< J.DÁI(E¿HLFN I%F{J.GaJ.H@ J.JXI8KDFyKD ELKD CNKDB>JNB>IP B>H¥BkHwB©Hw C2HwCNH±CNIL CNI¥DTJ4EZJ4'],
        xMin                       : 62,
        xMax                       : 566,
        yMin                       : -5,
        yMax                       : 641,
        width                      : 636
      };
      jur["4"]                     = {
        // shapeCmds                  : [[[500,160],[519,160,542,167,542,196],[542,225,519,232,500,232],[454,232],[454,641],[370,641],[34,235],[34,160],[378,160],[378,32],[378,6,396,-7,418,-7],[432,-7,454,-1,454,32],[454,160]]],
        sC                         : ['I*C¥ IPC¥I¡C³I¡DJ I¡D§IPDµI*Dµ HNDµ HNKD G%KD A©D» A©C¥ G6C¥ G6A¥ G6ANGZA4G©A4 H!A4HNA@HNA¥ HNC¥'],
        // holeCmds                   : [[[[378,232],[116,232],[378,550]]]],
        hC                         : [['G6Dµ C*Dµ G6I±']],
        xMin                       : 34,
        xMax                       : 542,
        yMin                       : -7,
        yMax                       : 641,
        width                      : 577
      };
      jur["5"]                     = {
        // shapeCmds                  : [[[97,141],[83,141,63,126,63,105],[63,48,217,-9,305,-9],[453,-9,557,80,557,233],[557,372,440,449,324,449],[146,449],[152,523],[156,560,170,569,196,569],[473,569],[507,569,515,590,515,604],[515,621,507,641,473,641],[204,641],[122,641,85,608,78,508],[69,377],[333,377],[390,377,485,344,485,233],[485,128,427,63,305,63],[186,63,122,141,97,141]]],
        sC                         : ['B§C] BiC]B@C>B@B· B@B!DuA0F#A0 HLA0I¿BcI¿D· I¿G*H2HDFJHD CgHD CsIX C{J!C¹J4DJJ4 HuJ4 I8J4IHJ_IHJ{ IHJ¿I8KDHuKD DZKD C6KDBmJ¥B_I: BLG4 F]G4 GNG4H¯FsH¯D· H¯CBG»B@F#B@ D6B@C6C]B§C]'],
        xMin                       : 63,
        xMax                       : 515,
        yMin                       : -9,
        yMax                       : 641,
        width                      : 608
      };
      jur["6"]                     = {
        // shapeCmds                  : [[[50,213],[50,83,152,-9,302,-9],[451,-9,554,83,554,214],[554,346,451,438,302,438],[247,438,195,425,155,401],[194,493,264,549,323,575],[331,579,353,590,353,611],[353,631,337,644,310,644],[263,644,50,513,50,213]]],
        sC                         : ['B%Dm B%BiCsA0EÁA0 HHA0I¹BiI¹Do I¹FwHHH.EÁH. E0H.DHG·CyGe DFH¿ERI¯FHJ@ FXJHF§J_F§J« F§K0FeKJF.KJ EPKJB%IDB%Dm'],
        // holeCmds                   : [[[[122,214],[122,305,184,366,302,366],[420,366,482,305,482,214],[482,123,419,63,302,63],[185,63,122,123,122,214]]]],
        hC                         : [['C6Do C6F#D2FÁEÁFÁ G­FÁH©F#H©Do H©C8G«B@EÁB@ D4B@C6C8C6Do']],
        xMin                       : 50,
        xMax                       : 554,
        yMin                       : -9,
        yMax                       : 644,
        width                      : 594
      };
      jur["7"]                     = {
        // shapeCmds                  : [[[245,-10],[268,-10,279,10,284,22],[512,590],[515,601,516,609,516,613],[516,630,507,646,480,646],[140,646],[66,646,30,613,30,524],[30,485,52,479,66,479],[95,479,102,501,102,524],[102,562,111,574,148,574],[430,574],[209,47],[206,41,202,33,202,23],[202,-3,230,-10,245,-10]]],
        sC                         : ['E,A. EZA.EqAVE{Ao IBJ_ IHJuIJJ§IJJ¯ IJK.I8KNH¥KN CZKN BFKNA¡J¯A¡IZ A¡H¯B*H£BFH£ B£H£B±I,B±IZ B±J%BÃJ>CkJ> GÁJ> DeAÃ D_A·DVA§DVAq DVA<D±A.E,A.'],
        xMin                       : 30,
        xMax                       : 516,
        yMin                       : -10,
        yMax                       : 646,
        width                      : 540
      };
      jur["8"]                     = {
        // shapeCmds                  : [[[577,178],[577,241,563,292,522,326],[560,352,577,401,577,468],[577,629,480,641,343,641],[308,641],[170,641,73,629,73,468],[73,401,91,353,129,326],[89,294,73,243,73,178],[73,23,161,-5,308,-5],[343,-5],[491,-5,577,24,577,178]]],
        sC                         : ['JDD% JDE#J(E­IVFN J!F¥JDGeJDHk JDK,H¥KDFqKD F*KD C¹KDBTK,BTHk BTGeByF§CDFN BuE±BTE(BTD% BTAqC§A8F*A8 FqA8 H»A8JDAsJDD%'],
        // holeCmds                   : [[[[145,180],[145,282,187,292,308,292],[343,292],[464,292,505,282,505,180],[505,76,464,67,343,67],[308,67],[185,67,145,77,145,180]],[[505,466],[505,365,468,364,343,364],[308,364],[184,364,145,366,145,466],[145,569,185,569,306,569],[343,569],[469,569,505,568,505,466]]]],
        hC                         : [['CeD* CeEwD8E­F*E­ FqE­ HcE­I4EwI4D* I4BZHcBHFqBH F*BH D4BHCeB]CeD*','I4Hg I4F¿HkF½FqF½ F*F½ D2F½CeFÁCeHg CeJ4D4J4F%J4 FqJ4 HmJ4I4J2I4Hg']],
        xMin                       : 73,
        xMax                       : 577,
        yMin                       : -5,
        yMax                       : 641,
        width                      : 650
      };
      jur["9"]                     = {
        // shapeCmds                  : [[[42,466],[42,304,215,292,312,292],[367,292,417,298,455,315],[403,129,243,57,158,57],[125,57,117,35,117,21],[117,3,127,-16,158,-16],[355,-16,546,177,546,466],[546,606,438,641,312,641],[230,641,42,628,42,466]]],
        sC                         : ['A¹Hg A¹F!DqE­F2E­ FÃE­G§E¹HPF8 GiCDE(B4C¡B4 C<B4C,A«C,Am C,AHC@A!C¡A! F«A!I©D#I©Hg I©J¡H.KDF2KD D±KDA¹K*A¹Hg'],
        // holeCmds                   : [[[[312,569],[437,569,474,528,474,466],[474,405,441,364,312,364],[218,364,114,373,114,466],[114,559,230,569,312,569]]]],
        hC                         : [['F2J4 H,J4HwIcHwHg HwGmH4F½F2F½ DwF½C%G,C%Hg C%IÃD±J4F2J4']],
        xMin                       : 42,
        xMax                       : 546,
        yMin                       : -16,
        yMax                       : 641,
        width                      : 595
      };
      jur["%"]                     = {
        // fullPath                   : "M 405 183 C 405 194 415 203 425 203 C 437 203 445 195 445 183 C 445 173 436 163 425 163 C 415 163 405 172 405 183 Z M 322 183 C 322 132 371 91 425 91 C 476 91 517 132 517 183 C 517 234 476 275 425 275 C 371 275 322 234 322 183 Z M 152 461 C 152 469 161 476 172 476 C 179 476 192 470 192 461 C 192 449 179 441 172 441 C 164 441 152 449 152 461 Z M 79 461 C 79 410 120 369 172 369 C 226 369 274 410 274 461 C 274 509 226 548 172 548 C 120 548 79 509 79 461 Z M 494 528 C 482 528 471 520 464 514 L 83 168 C 73 158 67 149 67 136 C 67 114 88 101 102 101 C 108 101 119 102 133 115 L 514 462 C 519 467 529 481 529 493 C 529 515 508 528 494 528 Z",
        shapeCmds                  : [
                                       [[494,528],[482,528,471,520,464,514],[83,168],[73,158,67,149,67,136],[67,114,88,101,102,101],[108,101,119,102,133,115],[514,462],[519,467,529,481,529,493],[529,515,508,528,494,528]],
                                       [[322,183],[322,132,371,91,425,91],[476,91,517,132,517,183],[517,234,476,275,425,275],[371,275,322,234,322,183]],
                                       [[79,461],[79,410,120,369,172,369],[226,369,274,410,274,461],[274,509,226,548,172,548],[120,548,79,509,79,461]]
                                     ],
        holeCmds                   : [
                                       [],
                                       [[[405,183],[405,194,415,203,425,203],[437,203,445,195,445,183],[445,173,436,163,425,163],[415,163,405,172,405,183]]],
                                       [[[152,461],[152,469,161,476,172,476],[179,476,192,470,192,461],[192,449,179,441,172,441],[164,441,152,449,152,461]]]
                                     ],
        xMin                       : 67,
        xMax                       : 529,
        yMin                       : 91,
        yMax                       : 548,
        width                      : 597
      };
      jur["-"]                     = {
        // fullPath                   : "M 359 267 L 114 267 C 82 267 73 245 73 231 C 73 213 83 194 114 194 L 359 194 C 384 194 403 208 403 229 C 403 253 386 267 359 267 Z",
        shapeCmds                  : [[[359,267],[114,267],[82,267,73,245,73,231],[73,213,83,194,114,194],[359,194],[384,194,403,208,403,229],[403,253,386,267,359,267]]],
        xMin                       : 73,
        xMax                       : 403,
        yMin                       : 194,
        yMax                       : 267,
        width                      : 476
      };
      jur[nbsp]                    = {
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 425
      };
      jur[" "]                     = jur[nbsp];
      return jur;
  };
  /*  
// https://opentype.js.org/glyph-inspector.html
function makeD(path){
  var d  = "",lastX=NaN;lastY=NaN;
  path.commands.forEach(function(cmd){d+=" "+cmd.type+coordinates(cmd)});
  return d.slice(1)
  function coordinates(cmd){
    if(cmd.x2){
      lastX  = cmd.x;
      lastY  = cmd.y;
      return " "+(Math.floor(2*cmd.x1)/2)+" "+(Math.floor(0-2*cmd.y1)/2)+" "+(Math.floor(2*cmd.x2)/2)+" "+(Math.floor(0-2*cmd.y2)/2)+" "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
    }else{
      if(cmd.x1){
        lastX  = cmd.x;
        lastY  = cmd.y;
        return " "+(Math.floor(2*cmd.x1)/2)+" "+(Math.floor(0-2*cmd.y1)/2)+" "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
      }else{
        if(cmd.x&&(lastX!==cmd.x||lastY!==cmd.y)){
          lastX  = cmd.x;
          lastY  = cmd.y;
          return " "+(Math.floor(2*cmd.x)/2)+" "+(Math.floor(0-2*cmd.y)/2)
        }else{
          return ""
        }
      }
    }
  }
};
}
 */




  //  WEBGL-DINGS  WEBGL-DINGS  WEBGL-DINGS  WEBGL-DINGS  WEBGL-DINGS  WEBGL-DINGS  WEBGL-DINGS 
  //
  //
  WGD                            = function(codeList){

      var wgd={reverseHoles:false,reverseShapes:true},nbsp="\u00A0";
      wgd["A"]                     = {
        xMin                       : -7,
        xMax                       : 675,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 667
      };
      wgd["B"]                     = {
        xMin                       : 76,
        xMax                       : 667,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 704
      };
      wgd["C"]                     = {
        xMin                       : 38,
        xMax                       : 684,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 722
      };
      wgd["D"]                     = {
        xMin                       : 76,
        xMax                       : 687,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      wgd["E"]                     = {
        xMin                       : 76,
        xMax                       : 597,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 630
      };
      wgd["F"]                     = {
        xMin                       : 76,
        xMax                       : 569,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 593
      };
      wgd["G"]                     = {
        xMin                       : 43,
        xMax                       : 699,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 759
      };
      wgd["H"]                     = {
        xMin                       : 73,
        xMax                       : 648,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      wgd["I"]                     = {
        xMin                       : 76,
        xMax                       : 201,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 278
      };
      wgd["J"]                     = {
        xMin                       : 13,
        xMax                       : 461,
        yMin                       : -17,
        yMax                       : 714,
        width                      : 537
      };
      wgd["K"]                     = {
        xMin                       : 76,
        xMax                       : 693,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 685
      };
      wgd["L"]                     = {
        xMin                       : 76,
        xMax                       : 564,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      wgd["M"]                     = {
        xMin                       : 48,
        xMax                       : 815,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 889
      };
      wgd["N"]                     = {
        xMin                       : 71,
        xMax                       : 650,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 722
      };
      wgd["O"]                     = {
        xMin                       : 38,
        xMax                       : 722,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 760
      };
      wgd["P"]                     = {
        xMin                       : 76,
        xMax                       : 634,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 667
      };
      wgd["Q"]                     = {
        xMin                       : 38,
        xMax                       : 722,
        yMin                       : -65,
        yMax                       : 731,
        width                      : 760
      };
      wgd["R"]                     = {
        xMin                       : 76,
        xMax                       : 680,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 704
      };
      wgd["S"]                     = {
        xMin                       : 33,
        xMax                       : 615,
        yMin                       : -17,
        yMax                       : 731,
        width                      : 648
      };
      wgd["T"]                     = {
        xMin                       : 8,
        xMax                       : 586,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 593
      };
      wgd["U"]                     = {
        xMin                       : 68,
        xMax                       : 654,
        yMin                       : -17,
        yMax                       : 714,
        width                      : 722
      };
      wgd["V"]                     = {
        xMin                       : -5,
        xMax                       : 616,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 611
      };
      wgd["W"]                     = {
        xMin                       : 6,
        xMax                       : 938,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 944
      };
      wgd["X"]                     = {
        xMin                       : -3,
        xMax                       : 651,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 648
      };
      wgd["Y"]                     = {
        xMin                       : -6,
        xMax                       : 654,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 648
      };
      wgd["Z"]                     = {
        xMin                       : 23,
        xMax                       : 608,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 630
      };
      wgd["a"]                     = {
        shapeCmds                  : [
                                        [
                                          [0,0],
                                          [0,  (36.4-20.6),(23.6-23.6), (36.4-6.4), (14.3-23.6) ,36.4,-23.6],
                                          [0,  3,1.2],
                                          [0,  (3-1.3) ,(3.1-2.5), (3+0.3) ,  (1.7-2.5),         3,-2.5],
                                          [0,  -2.7,-13.3],
                                          [0,  -0.3,-1.6,-2.2,-2.3,-3.5,-1.3],
                                          [0,  -10.9,8.1],
                                          [0,  -1.4,1,-1.1,3.2,0.5,3.9],
                                          [0,  2.9,1.1],
                                          [0,  -3.7,8,-10.5,14,-18.6,16.7],
                                          [0,  -3,1,-6.1,-1.2,-6.1,-4.4],
                                          [0,  0,-33.4],
                                          [0,  12.5,0],
                                          [0,  2.1,0,4.1,-1.5,4.3,-3.7],
                                          [0,  0.2,-2.4,-1.7,-4.5,-4.1,-4.5],
                                          [0,  -12.5,0],
                                          [0,  0,-11],
                                          [0,  6,-1.8,10.4,-7.4,10.3,-14],
                                          [0,  -0.1,-7.6,-6.4,-13.9,-14,-14.2],
                                          [0,  -8.1,-0.2,-14.8,6.3,-14.8,14.4],
                                          [0,  0,6.5,4.4,12,10.3,13.8],
                                          [0,  0,11],
                                          [0,  -12.5,0],
                                          [0,  -2.1,0,-4.1,1.5,-4.3,3.7],
                                          [0,  -0.2,2.4,1.7,4.5,4.1,4.5],
                                          [0,  12.8,0],
                                          [0,  0,33.4],
                                          [0,  0,3.2,-3.1,5.4,-6.1,4.4],
                                          [0,  -8.1,-2.8,-14.9,-8.7,-18.6,-16.7],
                                          [0,  2.9,-1.1],
                                          [0,  1.6,-0.6,1.9,-2.8,0.5,-3.9],
                                          [0,  -10.9,-8.1],
                                          [0,  -1.3,-1,-3.2,-0.3,-3.5,1.3],
                                          [0,  -2.7,13.3],
                                          [0,  -0.3,1.7,1.3,3.1,3,2.5],
                                          [0,  3,-1.2],
                                          [0,  6.4,14.3,20.6,23.6,36.4,23.6]
                                        ]
                                     ],
        holeCmds                   : [
                                        [
                                          (function(r){
                                            return [
                                              [0,-72.5],
                                              [0,   2.76*r,0*r,5*r,-2.24*r,5*r,-5*r],
                                              [0,  0*r,-2.76*r,-2.24*r,-5*r,-5*r,-5*r],
                                              [0,  -2.76*r,0*r,-5*r,2.24*r,-5*r,5*r],
                                              [0,  0*r,2.76*r,2.24*r,5*r,5*r,5*r]
                                            ]})(1.6)
                                        ]
                                     ],
        reverseShape               : false,
        reverseHole                : false,
        xFactor                    : 7,
        yFactor                    : -7,
        xShift                     : 350,          // These values are not calibrated
        xMin                       : -340,         // Refer to the next symbol for an example
        xMax                       : 340,
        yMin                       : 47,
        yMax                       : 806,
        width                      : 700,
        show                       : true
      };
      wgd["á"]                     = {
        shapeCmds                  : [
                                        [
                                          [0,0],
                                          [0,  (36.4-20.6),(23.6-23.6), (36.4-6.4), (14.3-23.6) ,36.4,-23.6],
                                          [0,  3,1.2],
                                          [0,  (3-1.3) ,(3.1-2.5), (3+0.3) ,  (1.7-2.5),         3,-2.5],
                                          [0,  -2.7,-13.3],
                                          [0,  -0.3,-1.6,-2.2,-2.3,-3.5,-1.3],
                                          [0,  -10.9,8.1],
                                          [0,  -1.4,1,-1.1,3.2,0.5,3.9],
                                          [0,  2.9,1.1],
                                          [0,  -3.7,8,-10.5,14,-18.6,16.7],
                                          [0,  -3,1,-6.1,-1.2,-6.1,-4.4],
                                          [0,  0,-33.4],
                                          [0,  12.5,0],
                                          [0,  2.1,0,4.1,-1.5,4.3,-3.7],
                                          [0,  0.2,-2.4,-1.7,-4.5,-4.1,-4.5],
                                          [0,  -12.5,0],
                                          [0,  0,-11],
                                          [0,  6,-1.8,10.4,-7.4,10.3,-14],
                                          [0,  -0.1,-7.6,-6.4,-13.9,-14,-14.2],
                                          [0,  -8.1,-0.2,-14.8,6.3,-14.8,14.4],
                                          [0,  0,6.5,4.4,12,10.3,13.8],
                                          [0,  0,11],
                                          [0,  -12.5,0],
                                          [0,  -2.1,0,-4.1,1.5,-4.3,3.7],
                                          [0,  -0.2,2.4,1.7,4.5,4.1,4.5],
                                          [0,  12.8,0],
                                          [0,  0,33.4],
                                          [0,  0,3.2,-3.1,5.4,-6.1,4.4],
                                          [0,  -8.1,-2.8,-14.9,-8.7,-18.6,-16.7],
                                          [0,  2.9,-1.1],
                                          [0,  1.6,-0.6,1.9,-2.8,0.5,-3.9],
                                          [0,  -10.9,-8.1],
                                          [0,  -1.3,-1,-3.2,-0.3,-3.5,1.3],
                                          [0,  -2.7,13.3],
                                          [0,  -0.3,1.7,1.3,3.1,3,2.5],
                                          [0,  3,-1.2],
                                          [0,  6.4,14.3,20.6,23.6,36.4,23.6]
                                        ],
                                        (function(r){
                                          return [
                                            [0,r*1.4],
                                            [0,   2.76*r,0*r,5*r,-2.24*r,5*r,-5*r],
                                            [0,  0*r,-2.76*r,-2.24*r,-5*r,-5*r,-5*r],
                                            [0,  -2.76*r,0*r,-5*r,2.24*r,-5*r,5*r],
                                            [0,  0*r,2.76*r,2.24*r,5*r,5*r,5*r]
                                          ]})(13)
                                     ],
        holeCmds                   : [
                                        [
                                          (function(r){
                                            return [
                                              [0,-72.5],
                                              [0,   2.76*r,0*r,5*r,-2.24*r,5*r,-5*r],
                                              [0,  0*r,-2.76*r,-2.24*r,-5*r,-5*r,-5*r],
                                              [0,  -2.76*r,0*r,-5*r,2.24*r,-5*r,5*r],
                                              [0,  0*r,2.76*r,2.24*r,5*r,5*r,5*r]
                                            ]})(1.6)
                                        ],
                                        [
                                          (function(r){
                                            return [
                                              [0,r*1.05],
                                              [0,   2.76*r,0*r,5*r,-2.24*r,5*r,-5*r],
                                              [0,  0*r,-2.76*r,-2.24*r,-5*r,-5*r,-5*r],
                                              [0,  -2.76*r,0*r,-5*r,2.24*r,-5*r,5*r],
                                              [0,  0*r,2.76*r,2.24*r,5*r,5*r,5*r]
                                            ]})(12)
                                        ]
                                     ],
        reverseShape               : false,
        reverseHole                : false,
        xFactor                    : 7,
        yFactor                    : -7,
        xShift                     : 475,
        yShift                     : -312.6,                // The middle is at the bottom reference -- a kludge
        xMin                       : 20,
        xMax                       : 950,
        yMin                       : -145.6,
        yMax                       : 894.4,
        width                      : 950,
        show                       : true
      };
      wgd["b"]                     = {
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 611
      };
      wgd["c"]                     = {
        xMin                       : 35,
        xMax                       : 523,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 556
      };
      wgd["d"]                     = {
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 611
      };
      wgd["e"]                     = {
        xMin                       : 35,
        xMax                       : 531,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 556
      };
      wgd["f"]                     = {
        xMin                       : 9,
        xMax                       : 317,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 315
      };
      wgd["g"]                     = {
        xMin                       : 35,
        xMax                       : 538,
        yMin                       : -205,
        yMax                       : 531,
        width                      : 593
      };
      wgd["h"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 574
      };
      wgd["i"]                     = {
        xMin                       : 48,
        xMax                       : 159,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      wgd["í"]                     = {
        xMin                       : 45,
        xMax                       : 270,
        yMin                       : 0,
        yMax                       : 731,
        width                      : 241
      };
      wgd["j"]                     = {
        xMin                       : -22,
        xMax                       : 177,
        yMin                       : -205,
        yMax                       : 714,
        width                      : 241
      };
      wgd["k"]                     = {
        xMin                       : 63,
        xMax                       : 542,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 537
      };
      wgd["l"]                     = {
        xMin                       : 63,
        xMax                       : 177,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 241
      };
      wgd["m"]                     = {
        xMin                       : 60,
        xMax                       : 810,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 870
      };
      wgd["n"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 574
      };
      wgd["o"]                     = {
        xMin                       : 36,
        xMax                       : 558,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 593
      };
      wgd["p"]                     = {
        xMin                       : 63,
        xMax                       : 575,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      wgd["q"]                     = {
        xMin                       : 35,
        xMax                       : 547,
        yMin                       : -191,
        yMax                       : 531,
        width                      : 611
      };
      wgd["r"]                     = {
        xMin                       : 60,
        xMax                       : 363,
        yMin                       : 0,
        yMax                       : 531,
        width                      : 352
      };
      wgd["s"]                     = {
        xMin                       : 32,
        xMax                       : 492,
        yMin                       : -14,
        yMax                       : 531,
        width                      : 519
      };
      wgd["t"]                     = {
        xMin                       : 8,
        xMax                       : 311,
        yMin                       : -5,
        yMax                       : 672,
        width                      : 333
      };
      wgd["u"]                     = {
        xMin                       : 60,
        xMax                       : 514,
        yMin                       : -14,
        yMax                       : 517,
        width                      : 574
      };
      wgd["v"]                     = {
        xMin                       : 9,
        xMax                       : 510,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 519
      };
      wgd["w"]                     = {
        xMin                       : 13,
        xMax                       : 765,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 778
      };
      wgd["x"]                     = {
        xMin                       : 4,
        xMax                       : 533,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 537
      };
      wgd["y"]                     = {
        xMin                       : 3,
        xMax                       : 515,
        yMin                       : -205,
        yMax                       : 517,
        width                      : 519
      };
      wgd["z"]                     = {
        xMin                       : 22,
        xMax                       : 477,
        yMin                       : 0,
        yMax                       : 517,
        width                      : 500
      };
      wgd["0"]                     = { 
        xMin                       : 36,
        xMax                       : 520,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      wgd["1"]                     = {
        xMin                       : 53,
        xMax                       : 350,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      wgd["2"]                     = {
        xMin                       : 39,
        xMax                       : 518,
        yMin                       : 0,
        yMax                       : 714,
        width                      : 556
      };
      wgd["3"]                     = {
        xMin                       : 31,
        xMax                       : 525,
        yMin                       : -14,
        yMax                       : 714,
        width                      : 556
      };
      wgd["4"]                     = {
        xMin                       : 24,
        xMax                       : 522,
        yMin                       : 0,
        yMax                       : 700,
        width                      : 556
      };
      wgd["5"]                     = { 
        xMin                       : 34,
        xMax                       : 522,
        yMin                       : -14,
        yMax                       : 700,
        width                      : 556
      };
      wgd[nbsp]                    = {
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 278
      };
      wgd[" "]                     = wgd[nbsp];

      return wgd;
  };

/*!
 * Babylon MeshWriter
 * https://github.com/BabylonJS/Babylon.js
 * (c) 2018-2019 Brian Todd Button
 * Released under the MIT license
 */

  // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
  // This function loads the specific type-faces and returns the superconstructor
  // If BABYLON is loaded, it assigns the superconstructor to BABYLON.MeshWriter
  // Otherwise it assigns it to global variable 'BABYLONTYPE'

  var Wrapper                    = (function(HPB,HNM,CSN,JUR,WGD){

    supplementBABYLONCurveFunctions();

    var scene,FONTS,defaultColor,defaultOpac,naturalLetterHeight,curveSampleSize,Γ=Math.floor,hpb,hnm,csn,jur,wgd,debug;
    var b128back,b128digits;
    prepArray();
    hpb                          = HPB(codeList);
    hnm                          = HNM(codeList);
    csn                          = CSN(codeList);
    jur                          = JUR(codeList);
    wgd                          = WGD(codeList);
    FONTS                        = {};
    FONTS["HirukoPro-Book"]      = hpb;
    FONTS["HelveticaNeue-Medium"]= hnm;
    FONTS["Helvetica"]           = hnm;
    FONTS["Arial"]               = hnm;
    FONTS["sans-serif"]          = hnm;
    FONTS["Comic"]               = csn;
    FONTS["comic"]               = csn;
    FONTS["ComicSans"]           = csn;
    FONTS["Jura"]                = jur;
    FONTS["jura"]                = jur;
    FONTS["WebGL-Dings"]         = wgd;
    FONTS["Web-dings"]           = wgd;
    defaultColor                 = "#808080";
    defaultOpac                  = 1;
    curveSampleSize              = 6;
    naturalLetterHeight          = 1000;

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    //  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR 
    // Parameters:
    //   ~ scene
    //   ~ preferences

    return function(){

      var proto,defaultFont,scale,meshOrigin,preferences;

      scene                      = arguments[0];
      preferences                = makePreferences(arguments);

      defaultFont                = isObject(FONTS[preferences.defaultFont]) ? preferences.defaultFont : "HelveticaNeue-Medium";
      meshOrigin                 = preferences.meshOrigin==="fontOrigin" ? preferences.meshOrigin : "letterCenter";
      scale                      = isNumber(preferences.scale)?preferences.scale:1;
      debug                      = isBoolean(preferences.debug)?preferences.debug:false;

      // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
      //  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR
      // Called with 'new'
      // Parameters:
      //   ~ letters
      //   ~ options

      function MeshWriter(lttrs,opt){

        var material,meshesAndBoxes,offsetX,meshes,lettersBoxes,lettersOrigins,combo,sps,mesh;

        //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  
        // Here we set *all* parameters with incoming value or a default
        // See documentation on setOption below
        var options              = isObject(opt) ? opt : { } ,
            position             = setOption ( options,  "position", isObject, {} ) ,
            colors               = setOption ( options,  "colors",   isObject, {} ) ,
            fontFamily           = setOption ( options,  "font-family", isSupportedFont, defaultFont ) ,
            anchor               = setOption ( options,  "anchor",   isSupportedAnchor, "left" ) ,
            rawheight            = setOption ( options,  "letter-height", isPositiveNumber, 100 ) ,
            rawThickness         = setOption ( options,  "letter-thickness", isPositiveNumber, 1 ) ,
            basicColor           = setOption ( options,  "color",    isString, defaultColor ) ,
            opac                 = setOption ( options,  "alpha",    isAmplitude, defaultOpac ) ,
            y                    = setOption ( position, "y",        isNumber, 0),
            x                    = setOption ( position, "x",        isNumber, 0),
            z                    = setOption ( position, "z",        isNumber, 0),
            diffuse              = setOption ( colors,   "diffuse",  isString, "#F0F0F0"),
            specular             = setOption ( colors,   "specular", isString, "#000000"),
            ambient              = setOption ( colors,   "ambient",  isString, "#F0F0F0"),
            emissive             = setOption ( colors,   "emissive", isString, basicColor),
            fontSpec             = FONTS[fontFamily],
            letterScale          = round(scale*rawheight/naturalLetterHeight),
            thickness            = round(scale*rawThickness),
            letters              = isString(lttrs) ? lttrs : "" ;

        // Create material
        material                 = makeMaterial(scene, letters, emissive, ambient, specular, diffuse, opac);

        // This creates an array of meshes, one for each letter
        // It also creates two other arrays of the same length, which are used for letter positioning
        meshesAndBoxes           = constructLetterPolygons(letters, fontSpec, 0, 0, 0, letterScale, thickness, material, meshOrigin);
        meshes                   = meshesAndBoxes[0];
        lettersBoxes             = meshesAndBoxes[1];
        lettersOrigins           = meshesAndBoxes[2];
        combo                    = makeSPS(scene, meshesAndBoxes, material);
        sps                      = combo[0];
        mesh                     = combo[1];

        offsetX                  = anchor==="right" ? (0-meshesAndBoxes.xWidth) : ( anchor==="center" ? (0-meshesAndBoxes.xWidth/2) : 0 );
        mesh.position.x          = scale*x+offsetX;
        mesh.position.y          = scale*y;
        mesh.position.z          = scale*z;

        this.getSPS              = function()  {return sps};
        this.getMesh             = function()  {return mesh};
        this.getMaterial         = function()  {return material};
        this.getOffsetX          = function()  {return offsetX};
        this.getLettersBoxes     = function()  {return lettersBoxes};
        this.getLettersOrigins   = function()  {return lettersOrigins};
        this.color               = function(c) {return isString(c)?color=c:color};
        this.alpha               = function(o) {return isAmplitude(o)?opac=o:opac};
        this.clearall            = function()  {sps=null;mesh=null;material=null};
      };

      proto                      = MeshWriter.prototype;

      proto.setColor             = function(color){
        var material             = this.getMaterial();
        if(isString(color)){
          material.emissiveColor = rgb2Bcolor3(this.color(color));
        }
      };
      proto.setAlpha             = function(alpha){
        var material             = this.getMaterial();
        if(isAmplitude(alpha)){
          material.alpha         = this.alpha(alpha)
        }
      };
      proto.overrideAlpha        = function(alpha){
        var material             = this.getMaterial();
        if(isAmplitude(alpha)){
          material.alpha         = alpha
        }
      };
      proto.resetAlpha           = function(){
        var material             = this.getMaterial();
        material.alpha           = this.alpha()
      };
      proto.getLetterCenter      = function(ix){
        return new BABYLON.Vector2(0,0)
      }
      proto.dispose              = function(){
        var mesh                 = this.getMesh(),
            sps                  = this.getSPS(),
            material             = this.getMaterial();
        if(sps){sps.dispose()}
        this.clearall()
      };
      MeshWriter.codeList        = codeList;

      return MeshWriter;

    };

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // MakeSPS turns the output of constructLetterPolygons into an SPS
    // with the whole string, with appropriate offsets
    function makeSPS(scene,meshesAndBoxes,material){
      var meshes                 = meshesAndBoxes[0],
          lettersOrigins         = meshesAndBoxes[2],sps,spsMesh;
      if(meshes.length){
        sps                      = new BABYLON.SolidParticleSystem("sps"+"test",scene, { } );
        meshes.forEach(function(mesh,ix){
          sps.addShape(mesh, 1, {positionFunction: makePositionParticle(lettersOrigins[ix])});
          mesh.dispose()
        });
        spsMesh                  = sps.buildMesh();
        spsMesh.material         = material;
        sps.setParticles()
      }
      return [sps,spsMesh];

      function makePositionParticle(letterOrigins){
        return function positionParticle(particle,ix,s){
          particle.position.x    = letterOrigins[0]+letterOrigins[1];
          particle.position.z    = letterOrigins[2]
        }
      }
    };

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // Takes specifications and returns an array with three elements, each of which
    // is an array (length of all arrays to match the number of incoming characters)
    //   ~ the meshes (not offset by position)
    //   ~ the boxes (to help with positions features) 
    //   ~ the letter origins (providing offset for each letter)
    function constructLetterPolygons(letters, fontSpec, xOffset, yOffset, zOffset, letterScale, thickness, material, meshOrigin){
      var letterOffsetX          = 0,
          lettersOrigins         = new Array(letters.length),
          lettersBoxes           = new Array(letters.length),
          lettersMeshes          = new Array(letters.length),
          ix                     = 0, letter, letterSpec, lists, shapesList, holesList, shape, holes, letterMesh, letterMeshes, letterBox, letterOrigins, meshesAndBoxes, i, j;

      for(i=0;i<letters.length;i++){
        letter                   = letters[i];
        letterSpec               = makeLetterSpec(fontSpec,letter);
        if(isObject(letterSpec)){
          lists                  = buildLetterMeshes(letter, i, letterSpec, fontSpec.reverseShapes, fontSpec.reverseHoles);
          shapesList             = lists[0];
          holesList              = lists[1];
          letterMeshes           = [];
          for(j=0;j<shapesList.length;j++){
            shape                = shapesList[j];
            holes                = holesList[j];
            if(isArray(holes)&&holes.length){
              letterMesh         = punchHolesInShape(shape, holes, letter, i)
            }else{
              letterMesh         = shape
            }
            letterMeshes.push(letterMesh);
          }
          if(letterMeshes.length){
            lettersMeshes[ix]    = merge(letterMeshes);
            lettersOrigins[ix]   = letterOrigins;
            lettersBoxes[ix]     = letterBox;
            ix++
          }
        }
      };
      meshesAndBoxes             = [lettersMeshes,lettersBoxes,lettersOrigins];
      meshesAndBoxes.xWidth      = round(letterOffsetX);
      meshesAndBoxes.count       = ix;
      return meshesAndBoxes;

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      // A letter may have one or more shapes and zero or more holes
      // The shapeCmds is an array of shapes
      // The holeCmds is an array of array of holes (since one shape 'B' may have multiple holes)
      // The arrays must line up so holes have the same index as the shape they subtract from
      // '%' is the best example since it has three shapes and two holes
      // 
      // For mystifying reasons, the holeCmds (provided by the font) must be reversed
      // from the original order and the shapeCmds must *not* be reversed
      // UNLESS the font is Jura, in which case the holeCmds are inverted from above instructions
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

      function buildLetterMeshes(letter, index, spec, reverseShapes, reverseHoles){
        var balanced             = meshOrigin === "letterCenter",
            centerX              = (spec.xMin+spec.xMax)/2,
            centerZ              = (spec.yMin+spec.yMax)/2,
            xFactor              = isNumber(spec.xFactor)?spec.xFactor:1,
            zFactor              = isNumber(spec.yFactor)?spec.yFactor:1,
            xShift               = isNumber(spec.xShift)?spec.xShift:0,
            zShift               = isNumber(spec.yShift)?spec.yShift:0,
            reverseShape         = isBoolean(spec.reverseShape)?spec.reverseShape:reverseShapes,
            reverseHole          = isBoolean(spec.reverseHole)?spec.reverseHole:reverseHoles,
            offX                 = xOffset-(balanced?centerX:0),
            offZ                 = zOffset-(balanced?centerZ:0),
            shapeCmdsLists       = isArray(spec.shapeCmds) ? spec.shapeCmds : [],
            holeCmdsListsArray   = isArray(spec.holeCmds) ? spec.holeCmds : [], thisX, lastX, thisZ, lastZ, minX=NaN, maxX=NaN, minZ=NaN, maxZ=NaN, minXadj=NaN, maxXadj=NaN, minZadj=NaN, maxZadj=NaN, combo,
            //  ~  ~  ~  ~  ~  ~  ~  
            // To accomodate letter-by-letter scaling and shifts, we have several adjust functions
            adjX                 = makeAdjust(letterScale,xFactor,offX,0,false,true),                     // no shift
            adjZ                 = makeAdjust(letterScale,zFactor,offZ,0,false,false),
            adjXfix              = makeAdjust(letterScale,xFactor,offX,xShift,false,true),                // shifted / fixed
            adjZfix              = makeAdjust(letterScale,zFactor,offZ,zShift,false,false),
            adjXrel              = makeAdjust(letterScale,xFactor,offX,xShift,true,true),                 // shifted / relative
            adjZrel              = makeAdjust(letterScale,zFactor,offZ,zShift,true,false);

        letterBox                = [ adjX(spec.xMin), adjX(spec.xMax), adjZ(spec.yMin), adjZ(spec.yMax) ];
        letterOrigins            = [ round(letterOffsetX), -1*adjX(0), -1*adjZ(0) ];
        letterOffsetX            = letterOffsetX+spec.width*letterScale;
        combo                    = [shapeCmdsLists.map(makeMeshFromCmdsList(reverseShape)),holeCmdsListsArray.map(meshesFromCmdsListArray)];

        if(debug&&spec.show){
          console.log([minX,maxX,minZ,maxZ]);
          console.log([minXadj,maxXadj,minZadj,maxZadj])
        }

        return combo;

        function meshesFromCmdsListArray(cmdsListArray){
          return cmdsListArray.map(makeMeshFromCmdsList(reverseHole))
        };
        function makeMeshFromCmdsList(reverse){
          return function meshFromCmdsList(cmdsList){
            var cmd              = getCmd(cmdsList,0),
                path             = new BABYLON.Path2(adjXfix(cmd[0]), adjZfix(cmd[1])), array, meshBuilder, mesh, j;

            for(j=1;j<cmdsList.length;j++){
              cmd                = getCmd(cmdsList,j);
              if(cmd.length===2){
                path.addLineTo(adjXfix(cmd[0]),adjZfix(cmd[1])) 
              }
              if(cmd.length===3){
                path.addLineTo(adjXrel(cmd[1]),adjZrel(cmd[2]));
              }
              if(cmd.length===4){
                path.addQuadraticCurveTo(adjXfix(cmd[0]),adjZfix(cmd[1]),adjXfix(cmd[2]),adjZfix(cmd[3]))
              }
              if(cmd.length===5){
                path.addQuadraticCurveTo(adjXrel(cmd[1]),adjZrel(cmd[2]),adjXrel(cmd[3]),adjZrel(cmd[4]));
              }
              if(cmd.length===6){
                path.addCubicCurveTo(adjXfix(cmd[0]),adjZfix(cmd[1]),adjXfix(cmd[2]),adjZfix(cmd[3]),adjXfix(cmd[4]),adjZfix(cmd[5]))
              }
              if(cmd.length===7){
                path.addCubicCurveTo(adjXrel(cmd[1]),adjZrel(cmd[2]),adjXrel(cmd[3]),adjZrel(cmd[4]),adjXrel(cmd[5]),adjZrel(cmd[6]))
              }
            }
            array                = path.getPoints().map(point2Vector);

            // Sometimes redundant coordinates will cause artifacts - delete them!
            if(array[0].x===array[array.length-1].x&&array[0].y===array[array.length-1].y){array=array.slice(1)}
            if(reverse){array.reverse()}

            meshBuilder          = new BABYLON.PolygonMeshBuilder("MeshWriter-"+letter+index+"-"+weeid(), array, scene);
            mesh                 = meshBuilder.build(true,thickness);
            return mesh;
          }
        };
        function getCmd(list,ix){
          var cmd,len;
          lastX                  = thisX;
          lastZ                  = thisZ;
          cmd                    = list[ix];
          len                    = cmd.length;
          thisX                  = len===3||len===5||len===7?round((cmd[len-2]*xFactor)+thisX):round(cmd[len-2]*xFactor);
          thisZ                  = len===3||len===5||len===7?round((cmd[len-1]*zFactor)+thisZ):round(cmd[len-1]*zFactor);
          minX                   = thisX>minX?minX:thisX;
          maxX                   = thisX<maxX?maxX:thisX;
          minXadj                = thisX+xShift>minXadj?minXadj:thisX+xShift;
          maxXadj                = thisX+xShift<maxXadj?maxXadj:thisX+xShift;
          minZ                   = thisZ>minZ?minZ:thisZ;
          maxZ                   = thisZ<maxZ?maxZ:thisZ;
          minZadj                = thisZ+zShift>minZadj?minZadj:thisZ+zShift;
          maxZadj                = thisZ+zShift<maxZadj?maxZadj:thisZ+zShift;
          return cmd
        };
        function makeAdjust(letterScale,factor,off,shift,relative,xAxis){
          if(relative){
            if(xAxis){
              return function(val){return round(letterScale*((val*factor)+shift+lastX+off))}
            }else{
              return function(val){return round(letterScale*((val*factor)+shift+lastZ+off))}
            }
          }else{
            return function(val){return round(letterScale*((val*factor)+shift+off))}
          }
        }
      };

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      function punchHolesInShape(shape,holes,letter,i){
        var csgShape             = BABYLON.CSG.FromMesh(shape);
        for(var k=0; k<holes.length; k++){
          csgShape               = csgShape.subtract(BABYLON.CSG.FromMesh(holes[k]))
        }
        holes.forEach(function(h){h.dispose()});
        shape.dispose();
        return csgShape.toMesh("Net-"+letter+i+"-"+weeid())
      };
    };

    function makeMaterial(scene,letters,emissive,ambient,specular,diffuse,opac){
      var cm0                    = new BABYLON.StandardMaterial("mw-matl-"+letters+"-"+weeid(),scene);
      cm0.diffuseColor           = rgb2Bcolor3(diffuse);
      cm0.specularColor          = rgb2Bcolor3(specular);
      cm0.ambientColor           = rgb2Bcolor3(ambient);
      cm0.emissiveColor          = rgb2Bcolor3(emissive);
      cm0.alpha                  = opac;
      return cm0
    };

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // These add two functions to Path2, which are needed for making font curves
    // 
    // Thanks Gijs, wherever you are
    // 
    function supplementBABYLONCurveFunctions(){
      if ( typeof BABYLON === "object" ) {
        if ( !BABYLON.Path2.prototype.addQuadraticCurveTo ) {
          BABYLON.Path2.prototype.addQuadraticCurveTo = function(redX, redY, blueX, blueY){
            var points           = this.getPoints();
            var lastPoint        = points[points.length - 1];
            var origin           = new BABYLON.Vector3(lastPoint.x, lastPoint.y, 0);
            var control          = new BABYLON.Vector3(redX, redY, 0);
            var destination      = new BABYLON.Vector3(blueX, blueY, 0);
            var nb_of_points     = curveSampleSize;
            var curve            = BABYLON.Curve3.CreateQuadraticBezier(origin, control, destination, nb_of_points);
            var curvePoints      = curve.getPoints();
            for(var i=1; i<curvePoints.length; i++){
              this.addLineTo(curvePoints[i].x, curvePoints[i].y);
            }
          }
        }
        if ( !BABYLON.Path2.prototype.addCubicCurveTo ) {
          BABYLON.Path2.prototype.addCubicCurveTo = function(redX, redY, greenX, greenY, blueX, blueY){
            var points           = this.getPoints();
            var lastPoint        = points[points.length - 1];
            var origin           = new BABYLON.Vector3(lastPoint.x, lastPoint.y, 0);
            var control1         = new BABYLON.Vector3(redX, redY, 0);
            var control2         = new BABYLON.Vector3(greenX, greenY, 0);
            var destination      = new BABYLON.Vector3(blueX, blueY, 0);
            var nb_of_points     = Math.floor(0.3+curveSampleSize*1.5);
            var curve            = BABYLON.Curve3.CreateCubicBezier(origin, control1, control2, destination, nb_of_points);
            var curvePoints      = curve.getPoints();
            for(var i=1; i<curvePoints.length; i++){
              this.addLineTo(curvePoints[i].x, curvePoints[i].y);
            }
          }
        }
      }
    }

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    //     FONT COMPRESSING AND DECOMPRESSING     FONT COMPRESSING AND DECOMPRESSING 
    //
    // One can reduce file size by 50% with a content-specific compression of font strings
    // Each letter object potentially has two long values, "shapeCmds" and "holeCmds"
    // These may be optionally compressed during construction of the file
    // The compressed versions are placed in "sC" and "hC"
    // The *first* time a letter is used, if it was compressed, it is decompressed
    function makeLetterSpec(fontSpec,letter){
      var letterSpec             = fontSpec[letter];
      if(isObject(letterSpec)){
        if(!isArray(letterSpec.shapeCmds)&&isArray(letterSpec.sC)){
          letterSpec.shapeCmds   = letterSpec.sC.map(function(cmds){return decodeList(cmds)})
          letterSpec.sC          = null;
        }
        if(!isArray(letterSpec.holeCmds)&&isArray(letterSpec.hC)){
          letterSpec.holeCmds    = letterSpec.hC.map(function(cmdslists){if(isArray(cmdslists)){return cmdslists.map(function(cmds){return decodeList(cmds)})}else{return cmdslists}});
          letterSpec.hC          = null;
        }
      }
      return letterSpec;

      function decodeList(str){
        var split  = str.split(" "),
            list   = [];
        split.forEach(function(cmds){
          if(cmds.length===12){list.push(decode6(cmds))}
          if(cmds.length===8) {list.push(decode4(cmds))}
          if(cmds.length===4) {list.push(decode2(cmds))}
        });
        return list
      };
      function decode6(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4)),decode1(s.substring(4,6)),decode1(s.substring(6,8)),decode1(s.substring(8,10)),decode1(s.substring(10,12))]};
      function decode4(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4)),decode1(s.substring(4,6)),decode1(s.substring(6,8))]};
      function decode2(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4))]};
      function decode1(s){return (frB128(s)-4000)/2};
    };
    function codeList(list){
      var str   = "",
          xtra  = "";
      if(isArray(list)){
        list.forEach(function(cmds){
          if(cmds.length===6){str+=xtra+code6(cmds);xtra=" "}
          if(cmds.length===4){str+=xtra+code4(cmds);xtra=" "}
          if(cmds.length===2){str+=xtra+code2(cmds);xtra=" "}
        });
      }
      return str;

      function code6(a){return code1(a[0])+code1(a[1])+code1(a[2])+code1(a[3])+code1(a[4])+code1(a[5])};
      function code4(a){return code1(a[0])+code1(a[1])+code1(a[2])+code1(a[3])};
      function code2(a){return code1(a[0])+code1(a[1])};
      function code1(n){return toB128((n+n)+4000)};
    };

    function frB128(s){
      var result=0,i=-1,l=s.length-1;
      while(i++<l){result = result*128+b128back[s.charCodeAt(i)]}
      return result;
    };
    function toB128(i){
      var s                      = b128digits[(i%128)];
      i                          = Γ(i/128);
      while (i>0) {
        s                        = b128digits[(i%128)]+s;
        i                        = Γ(i/128);
      }
      return s;
    };
    function prepArray(){
      var pntr                   = -1,n;
      b128back                   = new Uint8Array(256);
      b128digits                 = new Array(128);
      while(160>pntr++){
        if(pntr<128){
          n                      = fr128to256(pntr);
          b128digits[pntr]       = String.fromCharCode(n);
          b128back[n]            = pntr
        }else{
          if(pntr===128){
            b128back[32]         = pntr
          }else{
            b128back[pntr+71]    = pntr
          }
        }
      };
      function fr128to256(n){if(n<92){return n<58?n<6?n+33:n+34:n+35}else{return n+69}}
    };
    //     FONT COMPRESSING AND DECOMPRESSING     FONT COMPRESSING AND DECOMPRESSING 
    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    //     PARAMETER QUALIFYING AND DEFAULTING     PARAMETER QUALIFYING AND DEFAULTING 
    // 
    // Screening and defaulting functions for incoming parameters
    function makePreferences(args){
      var prefs = {},p;
      if(isObject(p=args[1])){
        if(p["default-font"]){prefs.defaultFont=p["default-font"]}else{if(p.defaultFont){prefs.defaultFont=p.defaultFont}}
        if(p["mesh-origin"]){prefs.meshOrigin=p["mesh-origin"]}else{if(p.meshOrigin){prefs.meshOrigin=p.meshOrigin}}
        if(p.scale){prefs.scale=p.scale}
        if(isBoolean(p.debug)){prefs.debug=p.debug}
        return prefs
      }else{
        return { defaultFont: args[2] , scale: args[1] , debug: false }
      }
    };

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  
    // Applies a test to potential incoming parameters
    // It the test passes, the parameters are used, otherwise the default is used
    function setOption(opts, field, tst, defalt) { return tst(opts[field]) ? opts[field] : defalt };

    //     PARAMETER QUALIFYING AND DEFAULTING     PARAMETER QUALIFYING AND DEFAULTING 
    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Conversion functions
    function rgb2Bcolor3(rgb){
      rgb                        = rgb.replace("#","");
      return new BABYLON.Color3(convert(rgb.substring(0,2)),convert(rgb.substring(2,4)),convert(rgb.substring(4,6)));
      function convert(x){return Γ(1000*Math.max(0,Math.min((isNumber(parseInt(x,16))?parseInt(x,16):0)/255,1)))/1000}
    };
    function point2Vector(point){
      return new BABYLON.Vector2(round(point.x),round(point.y))
    };
    function merge(arrayOfMeshes){
      return arrayOfMeshes.length===1 ? arrayOfMeshes[0] : BABYLON.Mesh.MergeMeshes(arrayOfMeshes, true)
    };

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Boolean test functions
    function isPositiveNumber(mn) { return typeof mn === "number" && !isNaN(mn) ? 0 < mn : false } ;
    function isNumber(mn)         { return typeof mn === "number" } ;
    function isBoolean(mn)        { return typeof mn === "boolean" } ;
    function isAmplitude(ma)      { return typeof ma === "number" && !isNaN(ma) ? 0 <= ma && ma <= 1 : false } ;
    function isObject(mo)         { return mo != null && typeof mo === "object" || typeof mo === "function" } ;
    function isArray(ma)          { return ma != null && typeof ma === "object" && ma.constructor === Array } ; 
    function isString(ms)         { return typeof ms === "string" ? ms.length>0 : false }  ;
    function isSupportedFont(ff)  { return isObject(FONTS[ff]) } ;
    function isSupportedAnchor(a) { return a==="left"||a==="right"||a==="center" } ;
    function weeid()              { return Math.floor(Math.random()*1000000) } ;
    function round(n)             { return Γ(0.3+n*1000000)/1000000 }

  })(HPB,HNM,CSN,JUR,WGD);

  root.TYPE                      = Wrapper;                      // This will keep some of the existing playgrounds running

  if ( typeof BABYLON === "object" ) {
    BABYLON.MeshWriter           = Wrapper
  }else{
    if ( typeof module === 'object' && module.exports ) {
      module.exports             = Wrapper;
    } else {
      if ( typeof define === 'function' && define.amd ) {
        define ( 'MeshWriter' , [], function() { return Wrapper } )
      } else {
        root.MeshWriter          = Wrapper
      }
    }
  }
  return Wrapper;


}).call(this);
