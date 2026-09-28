/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Project, Testimonial, ProcessStep, GearItem } from "./types";

/**
 * Helper to optimize Cloudinary image delivery:
 * Injects automatic format negotiation (WebP/AVIF), smart perceptual compression (q_auto),
 * and optional width resizing (c_limit) so images load blazingly fast.
 */
export function optimizeCloudinaryUrl(url?: string, width?: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || url.includes("/f_auto,q_auto")) {
    return url;
  }
  const transformation = width 
    ? `f_auto,q_auto,w_${width},c_limit` 
    : "f_auto,q_auto";
  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}

export const SERVICES: Service[] = [
  {
    "title": "Hindu Wedding (Wedding Day)",
    "startingPrice": "৳5,000",
    "deliverables": [
      "Shot by Shadman Alif",
      "Unlimited High-Resolution RAW Files",
      "No Editing Included",
      "Secure File Backup"
    ],
    "id": "cinematic-portraits",
    "description": "Full Wedding Day Coverage • RAW Files Only • No Editing Included",
    "iconName": "Camera",
    "subtitle": "Hindu Wedding (Wedding Day)"
  },
  {
    "title": "Outdoor Couple Session",
    "startingPrice": "৳2,000",
    "subtitle": "Pre-Wedding / Post-Wedding",
    "description": "Consistency across thousands of frames. Tailored color-grading, temperature matching, and highlight recovery designed specifically for active studios.",
    "deliverables": [
      "Unlimited RAW Files",
      "High-Resolution Files",
      "No Editing Included",
      "Online Delivery"
    ],
    "iconName": "Camera",
    "id": "color-correction"
  },
  {
    "id": "destination-weddings",
    "title": "Muslim Wedding (Per Day)",
    "deliverables": [
      "Shot by Shadman Alif",
      "Unlimited high-resolution raw captures",
      "Private persistent online gallery",
      "Same-Day File Backup"
    ],
    "startingPrice": "৳3,000",
    "iconName": "Camera",
    "subtitle": "Muslim Wedding (Per Day)",
    "description": "Up to 6 Hours Coverage • RAW Files Only • No Editing Included"
  },
  {
    "id": "remote-editing",
    "deliverables": [
      "Dedicated seasonal calendar slot",
      "Secure cloud file handoff workflow",
      "Unlimited retouching revisions",
      "Direct Slack/WhatsApp coordination",
      "Full Event File Editing"
    ],
    "startingPrice": "৳1200",
    "subtitle": "1 Camera Coverage",
    "title": "Remote Editing Support Full Event Editing",
    "description": "Complete Event Photo Editing • 1 Camera Files",
    "iconName": "Laptop"
  },
  {
    "title": "Reception Event",
    "id": "skin-retouching",
    "startingPrice": "৳3,000",
    "deliverables": [
      "Shot by Shadman Alif",
      "Unlimited RAW Files",
      "High-Resolution Files",
      "No Editing Included"
    ],
    "iconName": "Camera",
    "description": "Full Reception Coverage • RAW Files Only ",
    "subtitle": "Reception Event"
  },
  {
    "id": "wedding-photography",
    "startingPrice": "4000",
    "description": "Full-day wedding photography focusing on real, emotional, and story-driven interactions that feel timeless and cinematic.",
    "iconName": "Camera",
    "deliverables": [
      "Shot by Shadman Alif",
      "Unlimited high-resolution raw captures",
      "100+ Premium signature graded images",
      "Private persistent online gallery"
    ],
    "title": "Wedding Storytelling",
    "subtitle": "Candid moments & authentic emotions"
  }
];

export const PROJECTS: Project[] = [
  {
    "location": "Heritage Court, Old Dhaka",
    "tagline": "High-end skin retouching & classic warm color grading capturing intense heritage beauty.",
    "coupleNames": "Tonmoy & Bristy",
    "year": "2026",
    "category": "photography",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781327534/29_cn2hdu.jpg",
    "title": "Hindu Wedding Vanue",
    "id": "chitroborno-story",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327503/1_yebpg0.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327505/4_pbgcnj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327506/7_jr0sud.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327508/11_xy9qf8.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327510/12_czctpo.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327511/12_hfcqnc.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327513/14_onxtue.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327514/15_vnozyi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327516/17_tnx6jr.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327517/19_q65qoj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327519/20_hjcois.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327520/23_lkmaw1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327522/26_nxtbqc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327523/28_e1rrkk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327525/29_ass59u.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327526/32_sjvdrq.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327527/36_g9suke.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327530/37_tkbf8f.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327533/38_paniht.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327535/Chitroborno-392_nlouys.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327537/Chitroborno-480_shuduk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327539/Chitroborno-564_hblaqk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327541/Chitroborno-682_afu0qi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327542/Chitroborno-711_gyqgge.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327544/Chitroborno-776_xlmx0w.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327546/Chitroborno-800_ihloae.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327548/Chitroborno-835_cybnfd.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327550/Chitroborno-879_zxffeu.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327552/Chitroborno-935_r2meuk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327553/Chitroborno-940_xdrlnk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327555/Chitroborno-943_qgh8ub.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327557/Chitroborno-971_uvwlpy.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327559/Chitroborno-998_v95mo8.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327561/Chitroborno-1053_oifhcm.jpg"
    ]
  },
  {
    "location": "Mymensingh",
    "id": "editorial-skin-retouching",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781327758/Chitroborno-404_gsw1mi.jpg",
    "category": "couple-shoot",
    "year": "2025",
    "coupleNames": "Sheehab & Parna",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327728/1_ziglw3.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327730/2_fmxsg6.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327731/4_rh5sys.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327733/5_czhkq1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327734/6_yodbm1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327735/7_rpoy4e.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327736/8_j5g9of.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327737/10_jg2gcs.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327739/11_ilc8lu.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327740/16_o9xzpq.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327741/17_khxv1o.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327742/19_svcj6h.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327744/20_mwl0w1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327745/21_yiafwf.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327746/26_aqcprj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327748/27_rpnjq2.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327749/Chitroborno-13_bjtcug.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327751/Chitroborno-30_jhimbo.jpg"
    ],
    "title": "Akdh",
    "tagline": "Before/After high-end frequency separation and cinematic digital color restoration."
  },
  {
    "id": "mymensingh-twilight",
    "location": "Mymensingh, Bangladesh",
    "tagline": "Chasing clean pastel highlights and classic skin retouching along Mymensingh's historic waterfronts.",
    "coupleNames": "Sheehab & Parna ",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781327802/15_ahtice.jpg",
    "year": "2026",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327793/1_rohe1l.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327795/2_wvttlt.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327801/3_g469l5.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327804/4_prka59.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327810/5_ijqg0s.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327813/6_w9ala3.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327820/7_zfxhpg.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327827/8_q4mdsi.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327832/9_jz3bgv.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327837/10_jjppgz.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327840/11_lkmkol.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327842/12_bx78dn.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327843/13_ouwpsx.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327845/14_fbdos6.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327846/15_fzk7qw.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327847/16_pcxhpe.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327849/17_wqlzmb.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327851/18_ryixdk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327852/19_uucg2s.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327854/20_u0fy3o.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327855/21_cpcuxi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327857/22_exmyte.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327858/23_anxelc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327860/24_io3x8v.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327862/25_lakqsm.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327864/26_vwoto0.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327866/27_shv3tk.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327868/28_j8h6ju.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327869/29_bdwuhj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327871/30_afw2pz.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327872/31_tod5cu.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327873/32_lzt9tw.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327875/33_wrs5ln.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327876/34_xji2wd.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327878/35_ixxwgu.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327879/36_s2ezwq.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327880/37_v7qzgv.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327882/38_ucyzux.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327883/39_ltcri1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327884/40_wfxsn5.jpg"
    ],
    "category": "couple-shoot",
    "title": "Pre-Wedding"
  },
  {
    "tagline": "",
    "year": "2025",
    "category": "photography",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328047/1_limemi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328048/2_junmrw.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328051/5_dy80ne.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328052/6_vzdl13.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328054/7_m7bekx.png",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328056/8_rtl64a.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328059/9_jnud55.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328060/10_m7jlre.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328061/11_bjjfsr.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328062/12_cmo89j.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328064/13_si60tc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328066/15_vmm7mb.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328067/16_hcipxc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328068/17_rv4ojb.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328070/18_f6chzp.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328071/20_saw1q9.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328072/21_kex6ml.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328074/23_i1tozc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328076/24_nbn2bl.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328077/25_qkk2dh.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328078/26_sn07ri.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328080/28_xjom9p.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328081/29_qayuc6.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328082/30_mh9m6g.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328083/32_k4egxt.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328085/33_smgjjg.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328086/Chitroborno-27_tmnrwi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328088/Chitroborno-100_rrnobb.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328089/Chitroborno-116_it2xuy.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328090/Chitroborno-122_x7wabg.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328091/Chitroborno-125_cvagac.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328093/Chitroborno-175_icagdo.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328094/Chitroborno-178_ya0qw6.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328096/Chitroborno-324_yyrm5o.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328097/Chitroborno-338_rjrumv.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328099/Chitroborno-372_w2g5do.jpg"
    ],
    "title": "Muslim Wedding ",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781328068/1_z69equ.jpg",
    "coupleNames": "Muslim Wedding ",
    "id": "proj-1781328111018",
    "location": "Mymensingh"
  },
  {
    "location": "Mymensingh",
    "tagline": "",
    "year": "2026",
    "category": "photography",
    "id": "proj-1781328267776",
    "title": "Hindu Wedding Vanue",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781328257/Chitroborno-183_bwsxcp.jpg",
    "coupleNames": "Rimi ",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328191/1_badwtf.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328192/4_viydy4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328194/5_kd25ox.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328196/7_h9lbr5.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328197/8_bmetwe.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328198/Chitroborno-138_caf9rt.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328199/Chitroborno-143_xfa1fs.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328200/Chitroborno-151_ekgxwz.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328202/Chitroborno-166_o6ghz9.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328204/Chitroborno-175_obum5t.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328206/Chitroborno-183_mlviui.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328207/Chitroborno-198_qdcbjh.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328209/Chitroborno-298_wsgvi1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328210/Chitroborno-312_qg856x.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328211/Chitroborno-313_bag3od.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328213/Chitroborno-320_uvta16.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328214/Chitroborno-325_vw6ouh.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328215/Chitroborno-327_csjrk8.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328217/Chitroborno-328_ebsroj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328218/Chitroborno-343_fi2su7.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328220/Chitroborno-352_bbe3qt.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328221/Chitroborno-354_yhsikf.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328222/Chitroborno-363_c9pzor.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328224/Chitroborno-468_bcwwcx.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328226/Chitroborno-499_k9jo1n.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328227/Chitroborno-507_xh7bas.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328229/Chitroborno-515_avhnc8.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328230/Chitroborno-516_fxkd91.jpg"
    ]
  },
  {
    "title": "Outdoor",
    "year": "2026",
    "id": "proj-1781328345091",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328305/1_yabmbb.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328307/3_gtyh6n.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328308/4_ebydo5.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328309/5_yklmov.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328310/6_q1fgkq.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328311/7_jd9zq6.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328313/8_lsoevf.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328314/11_zchnhc.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328315/12_airj5x.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328317/13_ecys7w.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328318/15_ebpgig.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328319/17_rj4vew.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328320/18_kxbegg.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328322/20_buueyr.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328323/25_yvxjq5.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328324/26_uj79ne.jpg"
    ],
    "category": "traditional",
    "coupleNames": "Konka",
    "tagline": "",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781328325/18_pme8ii.jpg",
    "location": "Mymensingh"
  },
  {
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328378/1_s1nqkz.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328380/2_cywpj4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328381/4_gddygt.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328382/7_rbcsau.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328384/9_xyizry.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328385/10_gu7ri7.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328387/15_kjhchd.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328389/17_ihrow1.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328390/21_exz7en.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781328392/25_oznbw2.jpg"
    ],
    "coupleNames": "Sonia",
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781328403/4_u5iqy4.jpg",
    "year": "2026",
    "id": "proj-1781328408138",
    "category": "photography",
    "title": "Holud ",
    "tagline": "",
    "location": "Mymensingh"
  },
  {
    "mainImage": "https://res.cloudinary.com/db3uewokh/image/upload/v1781327939/2_f6nare.jpg",
    "location": "Mymensingh",
    "id": "riverine-romance",
    "tagline": "Natural, atmospheric pre-wedding session documenting raw companionship under moody monsoon clouds.",
    "category": "photography",
    "galleryImages": [
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327929/1_jpecbg.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327930/2_hujzyy.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327932/3_ga9cfi.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327935/4_gbwlvp.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327937/5_azr51h.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327940/6_ez1z6w.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327941/7_heaiud.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327943/8_a6dh6i.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327945/Chitroborno-2_zvy2z4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327947/Chitroborno-4_yt00ra.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327949/Chitroborno-5_owjuxr.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327950/Chitroborno-12_emzxc4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327952/Chitroborno-21_k4q1se.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327954/Chitroborno-27_t834gs.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327955/Chitroborno-30_shqxmj.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327957/Chitroborno-34_df7p0x.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327958/Chitroborno-35_yc3ura.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327960/Chitroborno-41_zafym7.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327961/Chitroborno-42_tqetg4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327963/Chitroborno-56_hlaqix.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327965/Chitroborno-75_tbi4s4.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327966/Chitroborno-82_d4x46j.jpg",
      "https://res.cloudinary.com/db3uewokh/image/upload/v1781327968/Chitroborno-96_vsr98h.jpg"
    ],
    "year": "2025",
    "title": "Muslim Wedding Vanue",
    "coupleNames": "Farzana"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    author: "Fardin Ahmed",
    role: "Lead, Chitroborno Team",
    text: "Shadman Alif is an outstanding asset with an exceptional grasp of light and digital editing. His time in the Chitroborno Team showed he cares profoundly about capturing storytelling compositions while delivering top-tier retouching that honors authentic emotions.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    location: "Dhaka, Bangladesh",
    eventDate: "Chitroborno Collab"
  },
  {
    id: "test-2",
    author: "Zayan & Maria",
    role: "Bride & Groom",
    text: "We booked Alif for our wedding in Mymensingh, and the experience was flawless. He worked with serene calm, and the cinematic couple portraits he crafted are treasures we will hold forever. His Photoshop skin-retouch is so fine and natural, it feels completely authentic!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    location: "Mymensingh Ceremony",
    eventDate: "December 2024"
  },
  {
    id: "test-3",
    author: "A. Tremblay",
    role: "Art Director, Studio Montreal",
    text: "Working with Shadman Alif as a remote photo editor has saved our sanity during peak season. He possesses impeccable attention to skin tones, shadow recovery, and color grading consistency. Our wedding clients are thrilled, and his turnarounds are incredibly reliable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    location: "Remote Editor Collaboration",
    eventDate: "Ongoing Partner"
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: "Consultation & Vision Planning",
    description: "Story First",
    details: "Every wedding begins with understanding your story, personalities, culture, and vision. We discuss your expectations, preferred style, important moments, and create a clear creative direction before the event day.",
    duration: "Phase 01"
  },
  {
    stepNumber: 2,
    title: "Cinematic Wedding Coverage",
    description: "Real Emotions",
    details: "On the wedding day, I focus on capturing genuine emotions, candid interactions, elegant portraits, family moments, and cinematic details with a storytelling approach that feels natural and timeless.",
    duration: "On Event"
  },
  {
    stepNumber: 3,
    title: "Color Grading & Visual Consistency",
    description: "Cinematic Tone",
    details: "Each image is carefully selected and professionally color graded to maintain a cohesive cinematic aesthetic, balanced skin tones, emotional depth, and premium visual consistency throughout the gallery.",
    duration: "Darkroom"
  },
  {
    stepNumber: 4,
    title: "High-End Retouching",
    description: "Premium Retouch",
    details: "Selected portraits receive detailed retouching and enhancement while preserving natural skin texture and authentic emotions. The goal is clean, elegant, magazine-quality results without looking artificial.",
    duration: "Surgical"
  },
  {
    stepNumber: 5,
    title: "Secure Delivery & Final Experience",
    description: "Timeless Delivery",
    details: "Final edited photographs are delivered through a secure online gallery with organized access, high-resolution downloads, and a smooth viewing experience for couples and families.",
    duration: "Delivery"
  }
];

export const STATS = [
  { value: "150+", label: "Weddings Preserved" },
  { value: "6+ Years", label: "Industry Experience" },
  { value: "12M+", label: "Pixels Retouched surgically" },
  { value: "100%", label: "Heartfelt Contentment" }
];

export const GEAR_ITEMS: GearItem[] = [
  {
    id: "sony-a7iii",
    name: "Sony a7III",
    category: "bodies",
    categoryLabel: "Camera Body",
    specs: "24.2MP • Exmor R CMOS • 5-Axis Stabilization",
    description: "The primary workhorse body. Renowned for low-light execution, dual card slots, and stellar dynamic spectrums to lock raw emotional moments.",
    tag: "Primary Body",
    tagColor: "bg-red-400",
  },
  {
    id: "sigma-85",
    name: "Sigma 85mm DG DN Art",
    category: "lenses",
    categoryLabel: "Portrait Prime Lens",
    specs: "f/1.4 Aperture • Star Sharpness • Ultimate compression",
    description: "Flagship portrait glass. Delivers razor-sharp eyes and majestic background separation with hand-painted editorial bokeh.",
    tag: "Signature Portrait",
    tagColor: "bg-yellow-400",
  },
  {
    id: "samyang-35",
    name: "Samyang 35mm F1.4",
    category: "lenses",
    categoryLabel: "Storytelling Prime Lens",
    specs: "f/1.4 Aperture • High Resolution • Cinematic Vignette",
    description: "Wide, intimate, and classic. Excellent for candid documentary moments, wedding details, and low-light environmental frames.",
    tag: "Cinematic Wide",
    tagColor: "bg-teal-300",
  },
  {
    id: "viltrox-20",
    name: "Viltrox 20mm",
    category: "lenses",
    categoryLabel: "Ultra-Wide Prime Lens",
    specs: "f/1.8 Aperture • Minimal Distortion • Wide Perspective",
    description: "Expansive venue details, epic landscape backgrounds on riverbanks, or crowded reception dance floors without bending lines.",
    tag: "Epic Ultra-Wide",
    tagColor: "bg-indigo-300",
  },
  {
    id: "viltrox-24",
    name: "Viltrox 24mm",
    category: "lenses",
    categoryLabel: "Compact Prime Lens",
    specs: "f/1.8 Aperture • Linear Autofocus • Crisp Contrast",
    description: "A compact prime perfect for unobtrusive coverage during bridal prep, morning tea ceremonies, and warm room candids.",
    tag: "Documentary Lens",
    tagColor: "bg-purple-300",
  },
  {
    id: "kf-ml60",
    name: "K&F ML 60",
    category: "lighting",
    categoryLabel: "COB Video Light",
    specs: "High-CRI Led • Silent Operation • Portable Battery Supported",
    description: "Continuous ultra-quiet light source. Creates gorgeous cinematic textures for short reels, evening teasers, and outdoor cinematic fill.",
    tag: "Continuous Light",
    tagColor: "bg-orange-400",
  },
  {
    id: "godox-850iii",
    name: "Godox V850III Flashes",
    category: "lighting",
    categoryLabel: "Speedlight System",
    specs: "Wireless 2.4G System • Fast Cycle Speed • High Capacity Li-ion",
    description: "High-speed-sync wireless speedlights. Orchestrates complex multi-flash bounce grids to freeze high-energy dance moves and group shots.",
    tag: "Speedlight Setup",
    tagColor: "bg-pink-300",
  },
  {
    id: "phottix-65",
    name: "Phottix 65 Softbox",
    category: "modifiers",
    categoryLabel: "Portable Softbox Modifier",
    specs: "65cm Diameter • Double Layer Inner/Outer Diffusion",
    description: "Double-diffused octagonal softbox creating delicate skin tones and wrap-around beauty highlight rolls for high-fashion portrait spreads.",
    tag: "Main Diffuser",
    tagColor: "bg-emerald-300",
  },
  {
    id: "godox-60-60",
    name: "Godox 60x60 Softbox",
    category: "modifiers",
    categoryLabel: "Grid Modifier",
    specs: "60x60cm Foldable • Detachable Grid Mesh included",
    description: "Controlled, sharp directional spill with a matching honeycomb grid. Excellent for isolating lighting on highlights and moody vignettes.",
    tag: "Grid Spotlight",
    tagColor: "bg-cyan-300",
  },
  {
    id: "macbook-m4",
    name: "MacBook Pro M4",
    category: "workstations",
    categoryLabel: "Editing Workstation",
    specs: "M4 Max/Pro • Liquid Retina XDR • Fully Calibrated Screen",
    description: "My primary workstation for premium fast editing. Handles color grading, complex noise reduction, and heavy-duty 4K video rendering seamlessly.",
    tag: "Pro Editing Rig",
    tagColor: "bg-indigo-300",
  },
];
