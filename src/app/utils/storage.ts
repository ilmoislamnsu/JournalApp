import { JournalEntry, Book } from '../types';

// ── Key helpers — all data is namespaced by user scope ────────────
// scope = user email for logged-in users, 'guest' for unauthenticated
function keys(scope: string) {
  return {
    entries: `journal_entries:${scope}`,
    books:   `journal_books:${scope}`,
    seeded:  `journal_demo_seeded:${scope}`,
  };
}

// ── Demo seed data ────────────────────────────────────────────────
const DEMO_BOOKS: Book[] = [
  { id: 'life',     name: 'Life',     color: '#AF52DE' },
  { id: 'work',     name: 'Work',     color: '#007AFF' },
  { id: 'travel',   name: 'Travel',   color: '#FF9500' },
  { id: 'fitness',  name: 'Fitness',  color: '#34C759' },
  { id: 'creative', name: 'Creative', color: '#FF2D55' },
];

const daysAgo = (n: number, hour = 20, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const DEMO_ENTRIES: JournalEntry[] = [
  // ── Life ──────────────────────────────────────────────────────
  {
    id: 'e-life-1', bookId: 'life',
    title: 'A Sunday that felt like home',
    mood: 'happy', date: daysAgo(1, 19, 30),
    tags: ['family', 'gratitude', 'sunday'],
    content: `Made a big pot of soup today — the kind that takes all afternoon and fills the whole apartment with smell. My sister dropped by unexpectedly around 3 PM and we ended up talking for four hours straight. About everything and nothing. Old memories, future plans, things we never quite managed to say before.

There's a particular kind of happiness that sneaks up on you in moments like this. Nothing was planned. Nothing was Instagram-worthy. But it was exactly right.

I want to remember this specific Sunday. The light coming through the kitchen window. The soup bubbling. Her laughing at something I said. It felt like home — not a place, but a feeling.

Grateful for: family who show up unannounced, slow cooking, and afternoons that stretch on forever.`,
  },
  {
    id: 'e-life-2', bookId: 'life',
    title: 'Hard conversation, good outcome',
    mood: 'neutral', date: daysAgo(5, 21, 15),
    tags: ['growth', 'relationships', 'honest'],
    content: `Had the conversation I'd been putting off for two weeks. I was braced for the worst — defensiveness, silence, maybe some tears. Instead it went... fine? Better than fine, actually.

Turns out the other person had been thinking the same things and waiting for someone to say them first. Funny how we both suffered two weeks of unnecessary dread.

Note to self: hard conversations almost never go as badly as the version in your head. The imagined version is always the worst possible outcome on loop. Reality tends to be more human, more forgiving.

Starting to think that discomfort is just the price of honesty, and honesty is the only thing that actually moves things forward.`,
  },
  {
    id: 'e-life-3', bookId: 'life',
    title: 'Feeling scattered, need a reset',
    mood: 'anxious', date: daysAgo(12, 22, 45),
    tags: ['mental health', 'overwhelm', 'reset'],
    content: `Everything feels loud today. Too many tabs open — in the browser and in my brain. I've been context-switching so much that I haven't actually finished a single thing all week.

I need to slow down and figure out what actually matters versus what just feels urgent. They're rarely the same thing.

Plan for tomorrow: wake up without my phone, write one clear priority for the day, do that thing first. Nothing else until it's done.

Also: sleep before midnight. Stop treating 2 AM like a deadline I have to hit.

Some seasons are harder than others. This is just a hard week. It will pass.`,
  },
  {
    id: 'e-life-4', bookId: 'life',
    title: 'Morning walk changed my whole day',
    mood: 'excited', date: daysAgo(18, 7, 20),
    tags: ['morning', 'nature', 'mindset'],
    content: `Got up at 6:30 on a whim and went for a walk before doing anything else. No headphones, no podcast. Just the neighbourhood at that strange quiet hour before most people are awake.

There's a dog that always sits in a second-floor window on the corner of my street. He was there. We made eye contact. I waved. It felt like a moment.

The whole day went differently after that. I was calmer. Decisions felt easier. Small problems stayed small.

I keep forgetting that the first hour of the day basically sets the temperature for everything that follows. Going to try to do this more regularly — no promises though. I know myself.`,
  },

  // ── Work ──────────────────────────────────────────────────────
  {
    id: 'e-work-1', bookId: 'work',
    title: 'Shipped the feature — finally',
    mood: 'excited', date: daysAgo(2, 18, 0),
    tags: ['milestone', 'product', 'team'],
    content: `We shipped. After six weeks of back-and-forth, two full redesigns, and one very memorable all-hands where nothing was decided — it's live.

The thing that almost killed this project was the gap between what the stakeholders wanted to say and what users actually needed to hear. We kept designing for the presentation and had to force ourselves to step back and design for the person sitting at a laptop at 11 PM trying to figure out their account.

The version that shipped is quieter, more focused, and honestly better for all the friction it went through.

Lesson: sometimes the difficult path is the refining path. Also: always advocate for the user, even when it's uncomfortable.

Celebrated with the team. Ordered too much food. No regrets.`,
  },
  {
    id: 'e-work-2', bookId: 'work',
    title: 'The meeting that could have been an email',
    mood: 'neutral', date: daysAgo(7, 16, 30),
    tags: ['meetings', 'productivity', 'reflection'],
    content: `Ninety minutes. Fourteen people. One actual decision made.

I'm going to start keeping a quiet log of meetings like this. Not to complain — well, maybe a little to complain — but because I think there's something to learn about how decisions actually get made (or don't) in this organisation.

My observation: the people who speak most in these meetings are rarely the ones whose opinion determines the outcome. There are usually two or three quiet people who matter enormously and say almost nothing until the last five minutes.

Next time I'm in a big room like this, I want to spend less time talking and more time watching who the room defers to when things get quiet.

Also: I'm going to start blocking 2–4 PM as a no-meeting zone. My brain simply does not work for real thinking after 3 PM in back-to-back sessions.`,
  },
  {
    id: 'e-work-3', bookId: 'work',
    title: 'Mentorship session that reminded me why I do this',
    mood: 'happy', date: daysAgo(14, 12, 0),
    tags: ['mentorship', 'purpose', 'career'],
    content: `Had my monthly check-in with the junior I've been mentoring since January. She came in with a problem she'd been stuck on for a week, we worked through it together, and I watched the exact moment it clicked for her.

That moment never gets old.

She asked me how long it took me to feel confident in the role. I told her the truth: longer than I expected, and I still have days where I feel like I'm making it up. She looked genuinely relieved.

I think one of the most underrated things you can do for someone early in their career is just be honest about the uncertainty you still carry. It doesn't make you look weak. It makes them feel less alone.

I left that meeting feeling more energised than I have all month. I should do more of this, not less.`,
  },
  {
    id: 'e-work-4', bookId: 'work',
    title: 'Rejection that stung, then made sense',
    mood: 'sad', date: daysAgo(21, 20, 0),
    tags: ['rejection', 'learning', 'resilience'],
    content: `The proposal got turned down. Not just tweaked — turned down entirely. "Not the right direction" was the phrase used, which is the professional equivalent of "it's not you, it's me" when it is very much you.

I was deflated for about two hours. Then I went back and read the proposal again, trying to see it fresh.

Honestly? Some of the feedback was fair. I got too attached to the solution and didn't spend enough time making the case for the problem. If someone doesn't feel the pain, they won't pay for the painkiller.

I'm going to rebuild the approach from the problem outward. And I'm going to get three people to poke holes in it before I show it to anyone with a title.

Rejection is data. Expensive data, but data.`,
  },

  // ── Travel ────────────────────────────────────────────────────
  {
    id: 'e-travel-1', bookId: 'travel',
    title: 'Kyoto in the rain — better than expected',
    mood: 'happy', date: daysAgo(30, 21, 0),
    tags: ['japan', 'kyoto', 'rain', 'temples'],
    content: `Everyone warned me about rain in Kyoto. "Avoid rainy season," they said. "It'll ruin the temples," they said.

They were wrong.

Fushimi Inari in the drizzle, with almost no one else there, fog threading through the thousands of torii gates — it looked like a painting that hadn't finished deciding if it was real yet. I walked for two hours without seeing another tourist.

The best travel moments I've had have almost always involved things going "wrong." Rain, missed trains, getting lost in the wrong neighbourhood. That's when the city shows you what it actually is, not what it performs for visitors.

Bought a tiny ceramic owl from a shop the size of a closet. The owner was maybe eighty and showed me three owls before deciding I deserved the one she'd made herself. I didn't ask for that. She just decided.

One of my favourite purchases ever.`,
  },
  {
    id: 'e-travel-2', bookId: 'travel',
    title: 'Road trip day 3 — somewhere in the middle',
    mood: 'excited', date: daysAgo(45, 17, 30),
    tags: ['roadtrip', 'desert', 'solitude', 'usa'],
    content: `Day 3. We've covered maybe 400 miles since yesterday morning and the landscape has done a full costume change. Mountains to flatland to red rock desert to something I don't have a word for.

There's a particular kind of silence in places this empty that you can't manufacture anywhere else. No white noise machine captures it. It's the silence of things being genuinely far away.

We pulled off at a viewpoint that wasn't on any app and sat on the hood of the car eating gas station sandwiches for forty minutes without talking. It wasn't awkward. It was necessary.

Tomorrow: another 300 miles and a motel with a pool that is definitely not going to look like the photos. Can't wait.

Miles driven: 1,147 total. Coffees consumed: too many to count. Regrets: none.`,
  },
  {
    id: 'e-travel-3', bookId: 'travel',
    title: "First time in a country where I don't speak the language",
    mood: 'anxious', date: daysAgo(60, 22, 0),
    tags: ['language', 'culture', 'solo', 'growth'],
    content: `I underestimated how disorienting it is to not understand anything around you. Not just signs and menus — tone, context, whether the person at the counter is annoyed or just busy. Everything requires more energy to interpret.

By midday I was exhausted and hadn't done anything physically demanding.

But here's what I noticed: people are remarkably patient when you're clearly trying. Three separate strangers today went out of their way to help me — one walked me four blocks to the correct bus stop because pointing wasn't going to cut it.

I think travelling in places where you're linguistically helpless teaches you to read people differently. You watch their hands, their faces, the direction they look when they're thinking. You pick up a lot that language usually drowns out.

Also downloaded a translation app tonight. Balance between humility and practicality.`,
  },

  // ── Fitness ───────────────────────────────────────────────────
  {
    id: 'e-fitness-1', bookId: 'fitness',
    title: 'Hit a new personal best today',
    mood: 'excited', date: daysAgo(3, 7, 45),
    tags: ['running', 'PB', 'milestone'],
    content: `5K in 24:12. That's 43 seconds faster than my previous best and I honestly did not see it coming today.

I almost didn't go. Alarm went off at 6:30, it was cold, I'd slept badly. I compromised with myself: "Just go. You can stop after 10 minutes if you hate it." I did not stop after 10 minutes.

There's something about the days you almost don't show up that turn out to be the best ones. The body knows things the tired brain doesn't.

Recovery plan: protein, stretch, sleep. Already booked Thursday's run in my calendar. Not letting this momentum evaporate.

Next target: sub-24. Feels impossible right now. That's exactly why it's the right target.`,
  },
  {
    id: 'e-fitness-2', bookId: 'fitness',
    title: 'Week 4 of the program — recalibrating',
    mood: 'neutral', date: daysAgo(9, 20, 30),
    tags: ['strength', 'consistency', 'habit'],
    content: `Four weeks in. The initial excitement has worn off and I'm now in the part where you just have to do the work without the novelty making it easy.

Stats this week:
- 3 strength sessions ✓
- 2 cardio sessions ✓
- Sleep avg: 6.8 hrs (need 7.5+)
- Water: inconsistent, will track properly next week

Biggest challenge isn't motivation — it's sleep. Everything else is suffering because I'm not recovering properly. Getting stronger in the gym while shorting my sleep is like trying to fill a bath with the drain open.

Adjusting bedtime from midnight to 10:30 starting tonight. It's going to feel weird. Doing it anyway.

Progress isn't always visible. Consistency is the whole thing right now.`,
  },
  {
    id: 'e-fitness-3', bookId: 'fitness',
    title: 'Rest day thoughts',
    mood: 'happy', date: daysAgo(16, 14, 0),
    tags: ['rest', 'recovery', 'mindset'],
    content: `Took a full rest day and managed to not feel guilty about it. Progress.

Six months ago I would have either trained anyway (bad) or spent the rest day feeling like I was losing ground (also bad). Today I just... rested. Read. Cooked a proper meal. Took a long shower and didn't rush it.

Rest is training. That's not a motivational poster thing, it's physiology. Muscles don't grow in the gym; they grow when you're recovering. I know this. I'm finally starting to actually believe it.

Feeling good about where this is heading. Not perfect, not linear, but genuinely heading somewhere.`,
  },

  // ── Creative ──────────────────────────────────────────────────
  {
    id: 'e-creative-1', bookId: 'creative',
    title: "The idea I can't stop thinking about",
    mood: 'excited', date: daysAgo(4, 23, 0),
    tags: ['ideas', 'writing', 'obsession'],
    content: `It arrived the way good ideas usually do — at the worst possible time (11 PM when I should be sleeping) in a form I didn't expect (a half-remembered dream image, not a fully formed concept).

A story about a lighthouse keeper who begins receiving messages from ships that haven't sailed in fifty years. Not a ghost story exactly — something more about memory and the way the past keeps broadcasting even when no one's listening.

I've written three pages of notes already and I can feel it expanding. The thing I love about early-stage ideas is that they're still possibility. Once you start writing them properly they become something more limited — a specific thing rather than all potential things.

Going to let this one breathe for another week before I start drafting. Feed it, don't force it.

The feeling of being genuinely excited about making something is one I want to chase more.`,
  },
  {
    id: 'e-creative-2', bookId: 'creative',
    title: 'Finished the painting — or gave up on it',
    mood: 'neutral', date: daysAgo(11, 18, 0),
    tags: ['painting', 'done', 'letting go'],
    content: `Put down the brush today and declared the painting finished. I'm not sure "finished" is accurate — "abandoned at a point I can live with" is more honest.

The middle section never did what I wanted it to do. I kept trying to fix it and it kept getting worse, so I left it intentionally ambiguous and told myself that was a choice. Maybe it is. Maybe that's how all creative work ends — you stop when the energy to continue runs out, and then in retrospect it looks like intention.

Starting to think that "done" is always a kind of letting go rather than a kind of completion. The thing is never fully what you imagined. At some point you release it.

Framed it anyway. It lives on the hallway wall now. I walk past it every morning and notice different things. So maybe it's still doing something.`,
  },
  {
    id: 'e-creative-3', bookId: 'creative',
    title: 'Started learning guitar — day 1 was humbling',
    mood: 'sad', date: daysAgo(25, 20, 30),
    tags: ['guitar', 'beginner', 'learning'],
    content: `I have been telling myself I would learn guitar for approximately eight years. Bought an acoustic six months ago. Picked it up seriously for the first time today.

It was humbling in a way I had not fully anticipated.

My fingers don't do what I ask them to. The chord shapes feel like I'm asking my hand to solve a puzzle it has never encountered. There were moments in the first hour where I genuinely wondered if I had the physical coordination for this.

Then I remembered: everyone who can play guitar also had a day one. Every person who plays anything beautiful was once someone who couldn't make the sounds they wanted.

Day one is supposed to be bad. That's what makes it the beginning.

Going to practice 15 minutes every day. Not more. Sustainable habits beat heroic efforts.`,
  },
  {
    id: 'e-creative-4', bookId: 'creative',
    title: 'Photography walk — seeing differently',
    mood: 'happy', date: daysAgo(33, 16, 0),
    tags: ['photography', 'observation', 'street'],
    content: `Took my camera out for three hours with no destination and no plan. Just walked and looked for things worth stopping for.

I've been on these streets hundreds of times. Today they looked completely different because I was moving slowly and looking for light instead of looking for where I was going.

The shots I'm happiest with:
— An old man feeding pigeons who kept looking at them like they were old friends
— A reflection in a puddle that inverted the entire street
— Someone's abandoned coffee cup on a wall with the city behind it

The act of looking for photographs teaches you to actually look. There's a lesson in there about attention and presence that applies to more than photography.

Coming home with a full card and tired feet. Good tired.`,
  },
];

// ── Seed function — scoped per user ───────────────────────────────
function seedDemoData(scope: string): void {
  const k = keys(scope);
  localStorage.setItem(k.books,   JSON.stringify(DEMO_BOOKS));
  localStorage.setItem(k.entries, JSON.stringify(DEMO_ENTRIES));
  localStorage.setItem(k.seeded,  'true');
}

// ── Book management ───────────────────────────────────────────────
export function getBooks(scope: string): Book[] {
  try {
    const k = keys(scope);
    if (!localStorage.getItem(k.seeded)) {
      seedDemoData(scope);
      return DEMO_BOOKS;
    }
    const stored = localStorage.getItem(k.books);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error loading books:', err);
    return [];
  }
}

export function saveBook(book: Book, scope: string): void {
  const k = keys(scope);
  const books = getBooks(scope);
  const idx = books.findIndex((b) => b.id === book.id);
  if (idx >= 0) books[idx] = book; else books.push(book);
  localStorage.setItem(k.books, JSON.stringify(books));
}

export function deleteBook(id: string, scope: string): void {
  const k = keys(scope);
  const books = getBooks(scope).filter((b) => b.id !== id);
  localStorage.setItem(k.books, JSON.stringify(books));
  const entries = getEntries(scope).filter((e) => e.bookId !== id);
  localStorage.setItem(k.entries, JSON.stringify(entries));
}

export function getBookById(id: string, scope: string): Book | null {
  return getBooks(scope).find((b) => b.id === id) ?? null;
}

// ── Entry management ──────────────────────────────────────────────
export function getEntries(scope: string): JournalEntry[] {
  try {
    const stored = localStorage.getItem(keys(scope).entries);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error loading entries:', err);
    return [];
  }
}

export function getEntriesByBook(bookId: string, scope: string): JournalEntry[] {
  return getEntries(scope).filter((e) => e.bookId === bookId);
}

export function saveEntry(entry: JournalEntry, scope: string): void {
  const k = keys(scope);
  const entries = getEntries(scope);
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) entries[idx] = entry; else entries.unshift(entry);
  localStorage.setItem(k.entries, JSON.stringify(entries));
}

export function deleteEntry(id: string, scope: string): void {
  const k = keys(scope);
  localStorage.setItem(k.entries, JSON.stringify(getEntries(scope).filter((e) => e.id !== id)));
}

export function getEntryById(id: string, scope: string): JournalEntry | null {
  return getEntries(scope).find((e) => e.id === id) ?? null;
}
