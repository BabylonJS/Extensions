//  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK  HIRUKOPRO-BOOK 
//
//

define(
  [],
  function(){

    return function(codeList){

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
        shapeCmds                  : [[[51,57],[51,642],[51,671,67,687.5],[83,704,107,704],[130,704,145.5,687.5],[161,671,161,642],[161,57],[161,29,145.5,12.5],[130,-4,107,-4],[83,-4,67,12.5],[51,29,51,57]]],
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
        shapeCmds                  : [[[40,251],[40,358,115.5,433],[191,508,299,508],[406,508,481,433],[556,358,556,251],[556,143,481,67.5],[406,-8,299,-8],[191,-8,115.5,67.5],[40,143,40,251]]],
        holeCmds                   : [[[[151,251],[151,189,194,146],[237,103,299,103],[360,103,402.5,146],[445,189,445,251],[445,312,402.5,354.5],[360,397,299,397],[237,397,194,354.5],[151,312,151,251]]]],
        xMin                       : 40,
        xMax                       : 556,
        yMin                       : -8,
        yMax                       : 508,
        width                      : 581
      };
      hpb["p"]                     = {
        shapeCmds                  : [[[106,504],[147,504,156,457],[223,508,309,508],[416,508,492,432.5],[568,357,568,250],[568,144,492,68.5],[416,-7,309,-7],[227,-7,161,41],[161,-142],[161,-170,145,-187],[129,-204,106,-204],[81,-204,66,-186.5],[51,-169,51,-142],[51,443],[51,469,67,486.5],[83,504,106,504]]],
        holeCmds                   : [[[[414,145],[457,188,457,250],[457,312,414,355],[371,398,309,398],[247,398,204.5,355],[162,312,162,250],[162,188,204.5,145],[247,102,309,102],[371,102,414,145]]]],
        xMin                       : 51,
        xMax                       : 568,
        yMin                       : -204,
        yMax                       : 508,
        width                      : 597
      };
      hpb["q"]                     = {
        shapeCmds                  : [[[448,457],[461,504,499,504],[499,504],[522,504,538,486.5],[554,469,554,443],[554,-142],[554,-170,539,-187],[524,-204,498,-204],[475,-204,459,-187],[443,-170,443,-142],[443,41],[379,-7,295,-7],[188,-7,112.5,68],[37,143,37,250],[37,357,112.5,432.5],[188,508,295,508],[382,508,448,457]]],
        holeCmds                   : [[[[190,355],[147,312,147,250],[147,188,190,145],[233,102,295,102],[357,102,400,145],[443,188,443,250],[443,312,400,355],[357,398,295,398],[233,398,190,355]]]],
        xMin                       : 37,
        xMax                       : 554,
        yMin                       : -204,
        yMax                       : 508,
        width                      : 585
      };
      hpb["r"]                     = {
        shapeCmds                  : [[[351,454],[351,394,290,394],[284,394,277,395],[270,396,259,396],[218,396,189.5,369.5],[161,343,161,291],[161,90],[161,-4,107,-4],[50,-4,50,74],[50,429],[50,504,104,504],[145,504,157,451],[215,506,278,506],[310,506,330.5,490],[351,474,351,454]]],
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
        shapeCmds                  : [[[102,496],[160,496],[160,563],[160,644,216,644],[270,644,270,563],[270,496],[327,496],[400,496,400,447],[400,396,327,396],[270,396],[270,81],[270,-4,216,-4],[216,-4],[184,-4,172,17],[160,38,160,81],[160,396],[102,396],[67,396,49,406.5],[31,417,31,443],[31,472,48.5,484],[66,496,102,496]]],
        xMin                       : 31,
        xMax                       : 400,
        yMin                       : -4,
        yMax                       : 644,
        width                      : 425
      };
      hpb["u"]                     = {
        shapeCmds                  : [[[158,442],[158,213],[158,168,191,135.5],[224,103,268,103],[315,103,346.5,129],[378,155,378,207],[378,417],[378,504,432,504],[465,504,475.5,483],[486,462,489,416],[489,81],[489,-5,433,-5],[397,-5,385,28],[337,-8,269,-8],[172,-8,110,51.5],[48,111,48,206],[48,416],[48,458,59.5,481],[71,504,102,504],[126,504,142,487.5],[158,471,158,442]]],
        xMin                       : 48,
        xMax                       : 489,
        yMin                       : -8,
        yMax                       : 504,
        width                      : 521
      };
      hpb["v"]                     = {
        shapeCmds                  : [[[182,34],[43,431],[39,443,39,450],[39,473,55.5,489],[72,505,95,505],[119,505,132,489],[145,473,155,443],[223,226],[232,196,238,181],[252,219,265.5,262.5],[279,306,295.5,361],[312,416,320,443],[330,473,343,489],[356,505,380,505],[380,505],[403,505,420,488.5],[437,472,437,450],[437,443,433,431],[294,34],[280,-4,238,-4],[195,-4,182,34]]],
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
        shapeCmds                  : [[[342,0],[130,0],[48,0,48,58],[48,58],[48,82,60,99],[226,347],[254,389],[231,393,196,393],[102,393],[82,393,65,409],[48,425,48,447],[48,469,64,484.5],[80,500,102,500],[312,500],[350,500,373,484],[396,468,396,439],[396,426,390,415],[372,384],[358,360,283,251.5],[208,143,190,110],[206,107,247,107],[342,107],[362,107,379,91],[396,75,396,54],[396,32,380,16],[364,0,342,0]]],
        xMin                       : 48,
        xMax                       : 396,
        yMin                       : 0,
        yMax                       : 500,
        width                      : 426
      };
      hpb["0"]                     = {
        shapeCmds                  : [[[475,66.5],[401,-8,300,-8],[199,-8,124.5,65],[50,138,50,241],[50,508],[50,608,124,682.5],[198,757,300,757],[399,757,474,685],[549,613,549,508],[549,241],[549,141,475,66.5]]],
        holeCmds                   : [[[[300,639],[245,639,205,598.5],[165,558,165,506],[165,243],[165,190,205,149.5],[245,109,300,109],[354,109,393,149],[432,189,432,243],[432,506],[432,560,393,599.5],[354,639,300,639]]]],
        xMin                       : 50,
        xMax                       : 549,
        yMin                       : -8,
        yMax                       : 757,
        width                      : 600
      };
      hpb["1"]                     = {
        shapeCmds                  : [[[390,12.5],[373,-4,348,-4],[323,-4,306.5,12.5],[290,29,290,53],[290,633],[290,643,281,643],[228,643],[205,643,189.5,658.5],[174,674,174,696],[174,719,189.5,734.5],[205,750,227,750],[361,750],[381,750,394,736],[407,722,407,701],[407,53],[407,29,390,12.5]]],
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
        shapeCmds                  : [[[561,181],[561,154,542.5,141],[524,128,505.5,125.5],[487,123,487,119],[487,67],[487,36,472,16.5],[457,-3,428,-3],[400,-3,385,17.5],[370,38,370,67],[370,119],[370,125,364,125],[124,125],[39,125,39,193],[39,214,52,238],[341,690],[353,709,362,720],[371,731,386.5,741.5],[402,752,420,752],[487,752,487,667],[487,243],[487,237,493,237],[500,237],[561,230,561,181]]],
        holeCmds                   : [[[[184,237],[364,237],[370,237,370,244],[370,539],[369,542],[368,542,366,540],[182,243],[181,242,181,240],[181,237,184,237]]]],
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
        shapeCmds                  : [[[308,509],[414,504,487.5,433.5],[561,363,561,253],[561,144,485,68],[409,-8,301,-8],[190,-8,114,67.5],[38,143,38,253],[38,329,73,384],[288,722],[309,754,341,754],[366,754,382.5,737],[399,720,399,695],[399,676,388,660],[304,532],[295,520,289,508],[294,509,308,509]]],
        holeCmds                   : [[[[300,398],[238,398,196.5,356.5],[155,315,155,253],[155,191,196.5,149.5],[238,108,300,108],[362,108,403,149.5],[444,191,444,253],[444,314,402.5,356],[361,398,300,398]]]],
        xMin                       : 38,
        xMax                       : 561,
        yMin                       : -8,
        yMax                       : 754,
        width                      : 600
      };
      hpb["7"]                     = {
        shapeCmds                  : [[[193,-4],[170,-4,152,13.5],[134,31,134,54],[134,67,136,70],[381,628],[382,632,382,633],[382,636,378,636],[141,636],[119,636,103,653],[87,670,87,693],[87,716,103,733],[119,750,141,750],[421,750],[463,750,487,724],[511,698,511,660],[511,651,506,631],[245,31],[230,-4,193,-4]]],
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
        shapeCmds                  : [[[51,541],[51,701,170,793],[185,805,205,805],[228,805,243.5,789.5],[259,774,259,751],[259,729,244,714],[196,667,181.5,623],[167,579,167,505],[167,198],[167,123,181.5,80],[196,37,244,-10],[259,-25,259,-48],[259,-70,243.5,-86],[228,-102,205,-102],[187,-102,170,-90],[51,4,51,162]]],
        xMin                       : 51,
        xMax                       : 259,
        yMin                       : -102,
        yMax                       : 805,
        width                      : 297
      };
      hpb[")"]                     = {
        shapeCmds                  : [[[257,162],[257,2,139,-90],[124,-102,104,-102],[81,-102,65.5,-86.5],[50,-71,50,-48],[50,-24,64,-10],[112,38,126.5,80.5],[141,123,141,198],[141,505],[141,580,126.5,623.5],[112,667,64,714],[50,728,50,751],[50,774,65.5,789.5],[81,805,104,805],[122,805,139,793],[257,701,257,541]]],
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
        fullPath                   : "M 43 65 Q 43 88 57 103 Q 71 118 91 118 Q 115 118 128.5 101 Q 142 84 142 59 L 142 -51 Q 142 -61 133 -69 Q 124 -77 114 -77 Q 96 -77 74.5 -30.5 Q 53 16 43 65 Z",
        shapeCmds                  : [[[43,65],[43,88,57,103],[71,118,91,118],[115,118,128.5,101],[142,84,142,59],[142,-51],[142,-61,133,-69],[124,-77,114,-77],[96,-77,74.5,-30.5],[53,16,43,65]]],
        xMin                       : 43,
        xMax                       : 142,
        yMin                       : -77,
        yMax                       : 118,
        width                      : 180
      };
      hpb["."]                     = {
        shapeCmds                  : [[[66,10.5],[51,25,51,45],[51,65,66.5,80.5],[82,96,103,96],[122,96,137,80.5],[152,65,152,45],[152,25,137.5,10.5],[123,-4,103,-4],[81,-4,66,10.5]]],
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

      return hpb;
    }
  }
);