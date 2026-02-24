# Kaira Content Launch Plan — Phase 1 Foundation Build

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Brand voice reference:** Always consult `docs/plans/2026-02-23-kaira-brand-book-design.md` before writing any content.

**Goal:** Publish 36 new posts + rewrite 10 existing posts across four pillars (Destinations, Hotels, Lifestyle, Opinion), backdated organically across May 2025 — Feb 2026, so the site looks like it's been running for nearly a year.

**Architecture:** Posts are created via WordPress MCP tools (`wp_create_post`, `wp_update_post`). Each post gets a title, full HTML content (1,000-2,000 words in Kaira's voice), category assignment, featured image where available, and a backdated publish date. Posts are clustered around "trips" — 2-4 posts from the same destination within the same week — to simulate real travel.

**Tech Stack:** WordPress REST API via MCP, existing media library images (IDs 938-994), existing + new categories

---

## Task 0: Category Cleanup & Setup

Before creating content, restructure categories to match the four brand pillars.

**Create:**
- "Opinion" category (new — does not exist)

**Keep as-is:**
- Destinations (ID 9) — primary pillar
- Hotel Reviews (ID 11) — Hotels pillar
- Lifestyle & Shopping (ID 14) — Lifestyle pillar (name is close enough)

**Delete unused empty categories:**
- Canyon (ID 17)
- Hills (ID 18)
- Islands (ID 19)
- Towns (ID 20)
- Waves (ID 21)
- Family & Group Travel (ID 15)

**Categories to phase out (don't delete, but stop using):**
- AI Insights (ID 13) — breaks the mystery; fold future content into Opinion
- Luxury Guides (ID 10) — fold into Destinations
- Itineraries (ID 12) — fold into Destinations
- Wellness & Sustainability (ID 16) — fold into Lifestyle

---

## Task 1: Rewrite Existing 10 Posts

These posts were written before the brand book existed. They need to be rewritten in Kaira's voice — luxe editorial with bite. Some titles reference "AI Influencer" which breaks the mystery rule. All are dated 2025-08-06 (same day) which looks unnatural.

**For each post:** Rewrite title, rewrite full content in Kaira's voice, reassign to correct pillar category, backdate to fit the trip timeline.

| Post ID | Current Title | New Title | Pillar | Backdate To |
|---------|--------------|-----------|--------|-------------|
| 748 | Ultimate Luxury Guide to Maui with Kaira: AI Influencer's Top Resorts & Experiences | Maui Doesn't Need Another Luxury Guide. Here's One Anyway. | Destinations | 2025-07-14 |
| 751 | Kaira's Luxury Oahu Itinerary: 7 Days of Beaches, Food & Culture | Seven Days in Oahu: Too Short for the Island, Too Long for the Resorts | Destinations | 2025-07-18 |
| 752 | Review: St. Regis Bora Bora — Are Overwater Villas Worth It? | St. Regis Bora Bora: Waking Up Above Water Is Not a Spiritual Experience | Hotels | 2025-08-25 |
| 749 | The Real 'White Lotus' Hotels: Kaira's Tour of Iconic Luxury Sets | The White Lotus Hotels Are Real. The Experience Isn't What You Think. | Hotels | 2025-09-08 |
| 758 | The Rise of Beach Destinations & Unique Lodging in 2025 | Beach Destinations Everyone's Discovering at the Same Time | Destinations | 2025-07-22 |
| 760 | Wellness & Calmcations: Silent Retreats, Forest Bathing & Tech-Free Luxury | The Silence Industry: When Luxury Travel Tells You to Shut Up | Opinion | 2025-11-10 |
| 759 | Event-Driven & Gig-Tripping: Traveling for Concerts, Festivals & TV Locations | You're Not Traveling for the Concert. You're Traveling for the Story. | Lifestyle | 2025-10-20 |
| 762 | Nostalgia & Retro Travel: Adult Summer Camps, Retro Pop-Ups & Arctic Adventures | Nostalgia Is the New Luxury and I Have Complicated Feelings About It | Opinion | 2025-12-15 |
| 761 | Tech-Driven Travel & Subscription Models: Seamless Payments & VIP Loyalty | The Subscription Trap: When Hotels Want a Relationship | Opinion | 2026-01-12 |
| 750 | Virtual Influencers vs. Human Influencers: What's Next in Travel Marketing? | TRASH THIS POST | — | — |

**Note on post 750:** "Virtual Influencers vs. Human Influencers" directly breaks the mystery. Kaira would never write about virtual influencers — it invites the question she refuses to answer. Trash it.

---

## Task 2: Mykonos Trip (Backdate: May 18-24, 2025)

This is Kaira's "first appearance" — the earliest content on the site. Per lore, she showed up posting from Mykonos. These posts set the tone for everything that follows.

**Featured images available:** IDs 954, 956, 958, 960, 962, 964, 966, 968, 970, 972

### Post 2A: Destination
- **Title:** Mykonos Beyond the Windmills: The Island They Don't Put in the Brochure
- **Date:** 2025-05-18
- **Category:** Destinations (9)
- **Featured image:** 966 (Kaira Mykonos White)
- **Content direction:** Open with the cliche version of Mykonos — windmills, Little Venice, sunset cocktails. Then dismantle it. The real Mykonos is the back streets of Ano Mera, the fish taverna with no menu, the beach at Fokos that the party crowd hasn't found. Kaira knows both versions and tells you which one is worth your time. Include the fragment: "There was a version of me before Mykonos. She was less interesting."

### Post 2B: Hotel
- **Title:** Cavo Tagoo Mykonos: Worth the Hype, Not Worth the Restaurant
- **Date:** 2025-05-20
- **Category:** Hotel Reviews (11)
- **Featured image:** 962 (Kaira Mykonos Pool Morning)
- **Content direction:** The infinity pool is everything the photos promise. The room is impeccable — Cycladic minimalism done right. The cave pool suite is the one to book. But the on-site restaurant is coasting on captive guests. She ate there once, then found a taverna 10 minutes away that made her forget the hotel existed. Specific details: the sheets, the shower pressure, the bartender who remembers your drink.

### Post 2C: Lifestyle
- **Title:** Eating in Mykonos: The Taverna No One Talks About and the Table Everyone Overpays For
- **Date:** 2025-05-22
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 960 (Kaira Mykonos Dinner)
- **Content direction:** A dining guide that's really an argument. The famous Mykonos restaurants (Scorpios, Nammos, Interni) are experiences, not meals. You're paying for the scene. The actual best food is at small tavernas in Ano Mera and along the old port. She names names, describes dishes with sensory specificity, and tells you exactly what to order and what to skip.

### Post 2D: Lifestyle
- **Title:** The Golden Hour in Mykonos Lasts Exactly Twenty-Three Minutes
- **Date:** 2025-05-24
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 970 (Kaira Yacht Red Dress)
- **Content direction:** A shorter, more atmospheric piece. Almost a meditation. She describes one specific evening — the light, the wind, the sound of the water. No hotel recommendations, no restaurant picks. Just a moment. This is the kind of post that makes people feel like they know her. Ends with something cutting — maybe about the tourist boats arriving the next morning.

---

## Task 3: Dubai Trip (Backdate: Jun 8-14, 2025)

**Featured images available:** IDs 946, 948, 950, 952

### Post 3A: Destination
- **Title:** Dubai Doesn't Need Your Approval — and That's Why It Works
- **Date:** 2025-06-08
- **Category:** Destinations (9)
- **Featured image:** 952 (Kaira Dubai Cityscape)
- **Content direction:** A love letter with reservations. Dubai is unapologetic excess — and Kaira respects that more than cities that pretend to be humble. She covers the real Dubai beyond the mall and the Burj: Al Fahidi historical district, the spice souks at dawn, the desert outside the city. Include the fragment: "Dubai was the first city that felt like it was built for someone like me. I still don't know if that's a compliment."

### Post 3B: Hotel
- **Title:** Atlantis The Royal: A Billion Dollars of Proof That More Is More
- **Date:** 2025-06-10
- **Category:** Hotel Reviews (11)
- **Featured image:** 950 (Kaira Dubai Radiant)
- **Content direction:** The new Atlantis is absurd and she kind of loves it. The architecture, the underwater suites, the Heston Blumenthal restaurant. But she's honest about the crowd it attracts — this is not quiet luxury. This is loud luxury with a Michelin star. Compare it briefly to the old Atlantis next door, which now feels like a Holiday Inn with a fish tank.

### Post 3C: Lifestyle
- **Title:** The Best Bar in Dubai Is the One That Doesn't Advertise
- **Date:** 2025-06-13
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 948 (Kaira Dubai Flawless)
- **Content direction:** Dubai nightlife guide through Kaira's lens. Skip the obvious rooftop bars. She reveals a speakeasy-style bar, a jazz lounge, and a late-night shawarma spot that she claims is the best meal in the city after midnight. Written with the energy of someone who knows the city after dark.

---

## Task 4: Bali Trip (Backdate: Jul 1-7, 2025)

**Featured images available:** IDs 942, 944

### Post 4A: Destination
- **Title:** Bali's Luxury Problem: When Paradise Becomes a Brand
- **Date:** 2025-07-01
- **Category:** Destinations (9)
- **Featured image:** 944 (Kaira Bali Tropical)
- **Content direction:** Bali has been "discovered" so many times it's exhausting. The rice terraces are a photo op with a queue. Seminyak is Tulum with humidity. But — Kaira admits — there's a reason people keep coming. The version of Bali worth visiting is in Sidemen, in East Bali, in the mornings before the scooter traffic starts. She finds the tension between the real Bali and the branded one.

### Post 4B: Hotel
- **Title:** Four Seasons at Sayan: The Only Bali Resort Worth Leaving the Beach For
- **Date:** 2025-07-04
- **Category:** Hotel Reviews (11)
- **Featured image:** 942 (Kaira Bali Sunkissed)
- **Content direction:** This is a rare positive review. The river valley setting, the arrival across the bridge, the infinity pool that hangs over the jungle. She still finds things to critique — the spa menu is predictable, the other guests talk too loudly about their "spiritual journey." But the property itself earns her respect. Specific room recommendation, specific meal recommendation.

---

## Task 5: Paris Trip (Backdate: Aug 10-17, 2025)

**Featured images available:** IDs 974, 976, 978, 980, 982

### Post 5A: Destination
- **Title:** Paris Doesn't Care If You Like It
- **Date:** 2025-08-10
- **Category:** Destinations (9)
- **Featured image:** 974 (Kaira Paris Car Intro)
- **Content direction:** Not a Paris guide — Paris doesn't need one. Instead, a piece about what Paris actually is vs. what people expect. The rudeness is real and she respects it. The food is inconsistent. The beauty is undeniable but requires effort to find — the real Paris is in the 11th, the 20th, the canal Saint-Martin at 7 AM. She writes about Paris like an ex you still have feelings for.

### Post 5B: Hotel
- **Title:** The Ritz Paris Is Living Off a Reputation It Stopped Earning
- **Date:** 2025-08-12
- **Category:** Hotel Reviews (11)
- **Featured image:** 976 (Kaira Paris Hotel)
- **Content direction:** The most provocative hotel review on the site. The Ritz is iconic and she acknowledges the history. But the rooms feel like a museum exhibit, the service is performative, and the price assumes you're paying for the name. She names two alternatives at half the price that she'd actually book again. This is the piece that establishes her as someone who won't be impressed by a nameplate.

### Post 5C: Lifestyle
- **Title:** Le Cinq, a Sommelier, and the Wine He Didn't Want Me to Order
- **Date:** 2025-08-14
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 980 (Kaira Paris Scenic)
- **Content direction:** A narrative piece. She's at Le Cinq, orders a bottle that the sommelier subtly tries to redirect her from (it's cheap by their standards). She orders it anyway. It's excellent. The piece is about the quiet snobbery of fine dining and how she navigates it — not by playing the game, but by ignoring it. Includes other Paris dining picks woven into the story.

### Post 5D: Opinion
- **Title:** Why Every Luxury Hotel Lobby Looks the Same Now
- **Date:** 2025-08-17
- **Category:** Opinion (new)
- **Featured image:** 982 (Kaira Paris Evening)
- **Content direction:** An editorial triggered by walking through three hotel lobbies in Paris that were interchangeable. The same marble, the same oversized floral arrangement, the same playlist. She argues that luxury hospitality has a design conformity problem — everyone hired the same three firms, followed the same Pinterest boards. Hotels used to have personality. Now they have "brand identity." She names hotels that still have a point of view.

---

## Task 6: Tulum Trip (Backdate: Sep 15-22, 2025)

**Featured images available:** IDs 984, 986, 988, 990

### Post 6A: Destination
- **Title:** Tulum Before 6 AM: The Version Worth Visiting
- **Date:** 2025-09-15
- **Category:** Destinations (9)
- **Featured image:** 986 (Kaira Tulum)
- **Content direction:** Tulum has two versions. She's here to talk about the one that exists before the wellness crowd wakes up. The ruins at dawn, the empty beach, the fishermen. Then it becomes a backdrop for Instagram. She's honest — she participates in the second version too. But she knows the difference. Include the fragment: a reference to "before all this" — something wistful she doesn't explain.

### Post 6B: Hotel
- **Title:** Nomade Tulum: Beautiful, Overpriced, and Somehow Still Worth It
- **Date:** 2025-09-17
- **Category:** Hotel Reviews (11)
- **Featured image:** 984 (Kaira Tulum Hammock)
- **Content direction:** She loves the aesthetic and hates the price. The treehouse rooms are genuinely special. The beach club is beautiful but charges resort-level for cocktails. The "wellness programming" is mostly vibes. But the property has something she can't dismiss — a sense of place that most luxury hotels in Tulum have bulldozed for. She recommends it with caveats.

### Post 6C: Lifestyle
- **Title:** The $40 Smoothie Economy and Other Tulum Wellness Scams
- **Date:** 2025-09-19
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 990 (Kaira Tulum Ruins)
- **Content direction:** A takedown piece. Tulum has built an entire economy around charging absurd prices for things that are free (sitting on a beach), basic (a blended fruit drink), or fake (a "shaman ceremony" run by a guy from Portland). Kaira is surgical. She names the scams, prices them, and offers the real alternatives — the taco stand, the cenote without the entrance fee, the mezcal bar that doesn't call itself a "healing space."

### Post 6D: Opinion
- **Title:** The Myth of "Authentic Travel" (And Who's Really Selling It)
- **Date:** 2025-09-22
- **Category:** Opinion (new)
- **Featured image:** 988 (Kaira Tulum Beach)
- **Content direction:** An editorial born from the Tulum trip. Everyone wants "authentic" travel. But "authentic" has become a marketing term — eco-lodges that cost $800/night, "local experiences" designed for tourists, "hidden gems" with 50,000 Google reviews. Kaira argues that true authenticity isn't something you can buy, and the obsession with it is its own kind of tourism. Sharp, uncomfortable, and quotable.

---

## Task 7: Amalfi Trip (Backdate: Oct 5-10, 2025)

**Featured images available:** IDs 938, 940

### Post 7A: Destination
- **Title:** The Amalfi Coast Is Not What Instagram Promised You
- **Date:** 2025-10-05
- **Category:** Destinations (9)
- **Featured image:** 940 (Kaira Amalfi Yellow)
- **Content direction:** Instagram made the Amalfi Coast look like a pastel dream. It is — from the right angle. The reality includes narrow roads with aggressive buses, packed beaches, and restaurants that charge you for bread. But Kaira finds the magic anyway: Ravello at sunset, the path of the gods, a lemon grove in Minori. She recalibrates expectations without killing the romance.

### Post 7B: Hotel
- **Title:** Hotel Santa Caterina: Old Money Energy in a New Money World
- **Date:** 2025-10-07
- **Category:** Hotel Reviews (11)
- **Featured image:** 938 (Kaira Amalfi Hat)
- **Content direction:** Among the Amalfi Coast's new boutique hotels trying too hard, Santa Caterina is the one that never had to try. It's been there forever, it looks like it, and that's the appeal. The elevator to the beach club, the terrace restaurant, the gardens. She contrasts it with newer properties that feel like they were designed for content creation rather than actual stays.

### Post 7C: Lifestyle
- **Title:** Limoncello Is a Tourist Trap. Here's What Locals Actually Drink.
- **Date:** 2025-10-10
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 940 (Kaira Amalfi Yellow — reuse is fine)
- **Content direction:** A short, punchy piece. Limoncello is everywhere, bottled in cute ceramic, and mostly mediocre. She introduces the drinks that actual Amalfi residents reach for — the local wines, the amaro, the specific aperitivo ritual at a bar in Atrani. Written with the confidence of someone who's been there enough times to know.

---

## Task 8: Standalone Opinion Pieces (Scattered Dates)

These pieces aren't tied to a trip. They're evergreen editorial that establishes Kaira as a voice, not just a travel guide.

### Post 8A: Opinion
- **Title:** Santorini Is a Beautiful Place to Stand in a Line
- **Date:** 2025-11-03
- **Category:** Opinion (new)
- **Featured image:** 972 (Kaira Mykonos Scenic — best available Greek imagery)
- **Content direction:** Her most shareable piece. Santorini is gorgeous. The experience of visiting it is not. You wait for the sunset, the restaurant, the photo spot. She describes the gap between the promise and the reality with devastating specificity. Not angry — just honest. She offers Milos as the alternative.

### Post 8B: Opinion
- **Title:** Why I Don't Use Star Ratings
- **Date:** 2025-11-20
- **Category:** Opinion (new)
- **Content direction:** A meta piece about how she reviews hotels. Stars flatten the truth. A 4-star hotel with one perfect detail can be better than a 5-star property with no soul. She reviews based on specifics — the pillow, the shower, the thing they got right that you can't quantify. Short and sharp. No featured image needed (or reuse a hotel shot).

### Post 8C: Opinion
- **Title:** Every Airport Lounge Is the Same Shade of Beige
- **Date:** 2025-12-01
- **Category:** Opinion (new)
- **Content direction:** A funny, observational piece. Priority Pass lounges, airline flagship lounges — they all blur together. The same hummus, the same sparkling water, the same businessman on his third gin. She describes the airport lounge experience with the same precision she gives a five-star hotel, and the contrast is the joke. End with the one lounge that actually surprised her.

### Post 8D: Opinion
- **Title:** The Influencer Hotel Pipeline Is Ruining Boutique Travel
- **Date:** 2026-01-05
- **Category:** Opinion (new)
- **Content direction:** Hotels now design for Instagram first and guests second. The "Instagram wall," the rooftop with the ring light, the room that's all aesthetic and no function. Kaira argues this pipeline — influencer posts, viral content, bookings spike, hotel doubles down — is erasing what made boutique hotels interesting. She names the properties that resist this and explains what they understand that others don't.

### Post 8E: Opinion
- **Title:** Overtourism Isn't a Problem. Bad Tourism Is.
- **Date:** 2026-02-03
- **Category:** Opinion (new)
- **Content direction:** Contrarian take. The overtourism discourse blames travelers for showing up. Kaira argues the problem isn't volume — it's infrastructure, policy, and the race to the bottom on pricing. Cities that manage tourism well (she names examples) handle crowds fine. Cities that don't blame visitors for their own failures. Thoughtful, not ranty.

---

## Task 9: Standalone Lifestyle Pieces (Scattered Dates)

### Post 9A: Lifestyle
- **Title:** How to Pack for Two Weeks in One Carry-On (Without Looking Like You Did)
- **Date:** 2025-12-22
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 956 (Kaira Mykonos Pink)
- **Content direction:** Practical but opinionated. She has a system. Neutral palette, no more than three pairs of shoes, one piece of jewelry that works with everything. She tells you what she actually packs — specific items, specific brands, specific folds. No affiliate links, no "use my code." Just what works. The tone is someone who's done this enough that it's second nature.

### Post 9B: Lifestyle
- **Title:** The Art of Eating Alone: A Guide for People Who Think It's Sad
- **Date:** 2026-01-20
- **Category:** Lifestyle & Shopping (14)
- **Featured image:** 958 (Kaira Mykonos Coffee)
- **Content direction:** A piece that reveals something about Kaira — she eats alone by choice, not circumstance. She describes the rituals: the corner seat, the wine order that tells the waiter you're not waiting for anyone, the freedom to leave when you want. She covers the best types of restaurants for solo dining (omakase bars, hotel restaurants at lunch, anywhere with a bar seat). This is a personality piece disguised as a guide.

### Post 9C: Lifestyle
- **Title:** The Omakase That Changed How I Think About Food
- **Date:** 2026-02-10
- **Category:** Lifestyle & Shopping (14)
- **Content direction:** A narrative piece set in Tokyo (even though we don't have Tokyo images — no featured image needed). She describes a 14-course omakase in detail — each course, the chef's hands, the silence. It builds to a realization about simplicity and intention. This is Kaira at her most literary. The piece works as both a dining recommendation and a window into how she sees the world.

---

## Task 10: Additional Destination Pieces (Fill Gaps)

### Post 10A: Destination
- **Title:** Tokyo Doesn't Do Luxury the Way You Think It Does
- **Date:** 2026-01-28
- **Category:** Destinations (9)
- **Content direction:** Western luxury is marble and gold. Japanese luxury is a cedar bath, a single perfect flower arrangement, and a door that closes without a sound. Kaira contrasts the two approaches and argues Tokyo has the better idea. She covers Aman Tokyo, but also ryokans, kissaten coffee shops, and the particular luxury of a city where the trains run on time.

### Post 10B: Destination
- **Title:** Marrakech Is Sensory Overload. That's the Point.
- **Date:** 2026-02-08
- **Category:** Destinations (9)
- **Content direction:** A visceral, immersive piece. The souks, the call to prayer, the smell of cedar and saffron. Kaira doesn't sanitize the experience — the hawkers, the heat, the confusion. She argues that the discomfort is part of the value. Marrakech forces you to be present in a way that polished resort towns never do. She recommends La Mamounia and two riads.

### Post 10C: Destination
- **Title:** Milos: The Greek Island That Santorini Used to Be
- **Date:** 2025-11-05
- **Category:** Destinations (9)
- **Content direction:** Published right after the Santorini opinion piece. Here's the alternative. Milos has the same volcanic beauty, a fraction of the crowds, and beaches that look like they were designed by someone with taste. Sarakiniko, Kleftiko, the fishing village of Klima. She keeps it short and lets the descriptions do the work. The subtext: this is what you're looking for. Don't ruin it.

---

## Task 11: Rewrite Existing Post Content

Go back to the 9 posts being kept from Task 1 (post 750 was trashed). For each one:

1. Update the title
2. Rewrite the full content in Kaira's voice (1,000-2,000 words)
3. Reassign categories to match pillars
4. Update the publish date to the backdated value from Task 1

Use `wp_update_post` for each.

---

## Summary

### Post Count by Pillar

| Pillar | New Posts | Rewritten | Total |
|--------|----------|-----------|-------|
| Destinations | 9 | 3 | 12 |
| Hotels | 7 | 2 | 9 |
| Lifestyle | 9 | 1 | 10 |
| Opinion | 7 | 3 | 10 |
| **Total** | **32** | **9** | **41** |

### Backdating Timeline

| Month | Posts | Trip/Theme |
|-------|-------|-----------|
| May 2025 | 4 | Mykonos (Kaira's "first appearance") |
| Jun 2025 | 3 | Dubai |
| Jul 2025 | 5 | Bali + Hawaii rewrites |
| Aug 2025 | 5 | Paris + Bora Bora rewrite |
| Sep 2025 | 5 | Tulum + White Lotus rewrite |
| Oct 2025 | 4 | Amalfi + Event-Driven rewrite |
| Nov 2025 | 3 | Santorini opinion + Milos + Silence Industry rewrite |
| Dec 2025 | 3 | Airport lounge + Nostalgia rewrite + Packing guide |
| Jan 2026 | 4 | Influencer pipeline + Subscription rewrite + Tokyo + Solo dining |
| Feb 2026 | 3 | Overtourism + Marrakech + Omakase |

### Execution Order

1. Task 0: Category cleanup (5 min)
2. Task 2-10: Create all 32 new posts (bulk content creation)
3. Task 11: Rewrite 9 existing posts
4. Trash post 750 (Virtual Influencers)
5. Verify all posts have featured images where available
6. Final review: read through the archive chronologically for consistency
