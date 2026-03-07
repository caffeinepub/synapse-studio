import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
 // separate migration module


actor {
  type Project = {
    id : Nat;
    title : Text;
    jsonOutput : Text;
    timestamp : Int;
  };

  module Project {
    public func compare(x : Project, y : Project) : Order.Order {
      Nat.compare(x.id, y.id);
    };
  };

  var nextProjectId = 1; // Initialize nextProjectId to 1

  let projects = Map.empty<Nat, Project>();

  type Bot = {
    id : Nat;
    name : Text;
    avatar : Text;
    personality : Text;
    linkedWiki : ?Text;
  };

  type Memory = {
    id : Nat;
    botId : Nat;
    memoryType : Text; // "conversation", "training", "wiki", "feedback"
    content : Text;
    topic : Text;
    timestamp : Int;
    sentiment : Int; // 1 = positive, 0 = neutral, -1 = negative
  };

  let bots = Map.empty<Nat, Bot>();
  let memories = Map.empty<Nat, Memory>();

  var nextBotId = 1;
  var nextMemoryId = 1;

  func validateChakra(chakraName : Text) {
    let validChakras = [
      "",
      "Root",
      "Sacral",
      "SolarPlexus",
      "Heart",
      "Throat",
      "ThirdEye",
      "Crown",
    ];
    if (not validChakras.values().contains(chakraName)) {
      Runtime.trap("Invalid chakra name");
    };
  };

  func getBoosterPhrases() : [Text] {
    [
      "I am powerfully",
      "My essence radiates with",
      "Every cell of my being is filled with",
      "I embody",
      "I attract",
      "I am the living expression of",
    ];
  };

  func getFantasyMetaphors() : [(Text, Text)] {
    [
      ("telekinesis", "My mind moves realities as easily as a feather in the breeze."),
      ("pyrokinesis", "I ignite my passion with the intensity of a thousand suns."),
      ("electrokinesis", "My thoughts spark with the brilliance of lightning."),
      ("chronokinesis", "I flow with time, perfectly balancing past, present, and future."),
      ("aerokinesis", "I adapt with the fluidity of ever-changing winds."),
      ("hydrokinesis", "My emotional currents are calm and harmonious."),
      ("geokinesis", "I stand strong and unwavering, like a mountain rooted to the earth."),
      ("biokinesis", "I nurture my well-being, encouraging positive growth in every aspect of my life."),
      ("technokinesis", "I integrate new knowledge and skills effortlessly, adapting to challenges with ease."),
      ("cryokinesis", "My tranquility cools and soothes any arising uncertainty."),
      ("photokinesis", "I radiate warmth and positivity to those around me."),
      ("umbrakinesis", "I embrace and integrate all parts of myself, fostering a sense of wholeness."),
    ];
  };

  public query ({ caller }) func generateAffirmations(
    topic : Text,
    boosterEnabled : Bool,
    fantasyEnabled : Bool,
    protectionEnabled : Bool,
    chakraName : Text,
  ) : async [Text] {
    validateChakra(chakraName);

    let baseAffirmations = List.empty<Text>();
    baseAffirmations.add("I am confident in my " # topic # ".");
    baseAffirmations.add("My " # topic # " is strong and growing.");
    baseAffirmations.add("I trust in my ability to improve my " # topic # ".");

    if (boosterEnabled) {
      for (phrase in getBoosterPhrases().values()) {
        baseAffirmations.add(phrase # " " # topic # ".");
      };
    };

    if (fantasyEnabled) {
      for (metaphor in getFantasyMetaphors().values()) {
        baseAffirmations.add(metaphor.1);
      };
    };

    if (protectionEnabled) {
      baseAffirmations.add("My presence is grounded and unwavering.");
      baseAffirmations.add("My energy remains steady and protected.");
    };

    if (chakraName != "") {
      baseAffirmations.add("My " # chakraName # " chakra is balanced and harmonious.");
      baseAffirmations.add("I align my energy with the " # chakraName # " chakra's purpose.");
    };

    baseAffirmations.reverse().toArray();
  };

  public query ({ caller }) func getFantasyMapping(abilityName : Text) : async Text {
    let mappings = Map.fromIter<Text, { #symbolic : Text }>(
      [
        ("telekinesis", #symbolic("Mind over matter")),
        ("pyrokinesis", #symbolic("Ignite passion")),
        ("electrokinesis", #symbolic("Spark ideas")),
      ].values(),
    );
    switch (mappings.get(abilityName)) {
      case (?mapping) {
        switch (mapping) {
          case (#symbolic(symbolicText)) {
            "{" # "\"symbolic\": \"" # symbolicText # "\" }";
          };
        };
      };
      case (null) {
        "{" # "\"symbolic\": \"General empowerment\" }";
      };
    };
  };

  public query ({
    caller;
  }) func buildProjectJSON(
    topic : Text,
    affirmations : [Text],
    boosterEnabled : Bool,
    fantasyEnabled : Bool,
    fantasyInput : Text,
    protectionEnabled : Bool,
    chakraName : Text,
    voiceType : Text,
    voiceSpeed : Float,
    voicePitch : Float,
    repetitionCount : Nat,
    whisperOverlay : Bool,
    backgroundMusicType : Text,
    subliminalFrequency : Text,
    musicVolume : Float,
    subliminalVolume : Float,
    waveformOverlay : Bool,
    stereoMovement : Bool,
    themeStyle : Text,
    colorPalette : Text,
    resolution : Text,
    durationSeconds : Nat,
    frameRate : Nat,
  ) : async Text {
    "{ \"success\": true }";
  };

  public shared ({ caller }) func saveProject(title : Text, jsonOutput : Text) : async Nat {
    let project : Project = {
      id = nextProjectId;
      title;
      jsonOutput;
      timestamp = Time.now();
    };
    projects.add(project.id, project);
    nextProjectId += 1;
    project.id;
  };

  public query ({ caller }) func getProject(id : Nat) : async ?Text {
    switch (projects.get(id)) {
      case (?project) { ?project.jsonOutput };
      case (null) { null };
    };
  };

  public query ({ caller }) func listProjects() : async [(Nat, Text, Int)] {
    projects.values().toArray().map(func(project) { (project.id, project.title, project.timestamp) });
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async Bool {
    switch (projects.get(id)) {
      case (null) { false };
      case (?_) {
        projects.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllChakras() : async Text {
    "[{\"name\": \"Root\", \"overview\": \"Stability and security.\"}]";
  };

  public query ({ caller }) func getAllKinesisEntries() : async Text {
    "[{\"name\": \"Telekinesis\", \"symbolicMeaning\": \"Mind over matter.\"}]";
  };

  public query ({ caller }) func getBeliefSystems() : async Text {
    "[{\"name\": \"Manifestation\", \"summary\": \"Creating reality through intention.\"}]";
  };

  // Bot Management
  public shared ({ caller }) func createBot(name : Text, avatar : Text, personality : Text, linkedWiki : ?Text) : async Nat {
    let bot : Bot = {
      id = nextBotId;
      name;
      avatar;
      personality;
      linkedWiki;
    };
    bots.add(bot.id, bot);
    nextBotId += 1;
    bot.id;
  };

  public query ({ caller }) func getBot(id : Nat) : async ?Bot {
    bots.get(id);
  };

  public query ({ caller }) func getAllBots() : async [Bot] {
    bots.values().toArray();
  };

  public shared ({ caller }) func deleteBot(id : Nat) : async Bool {
    switch (bots.get(id)) {
      case (null) { false };
      case (?_) {
        // Remove memories associated with this bot
        let memoryIdsToRemove = List.empty<Nat>();
        for (memory in memories.values()) {
          if (memory.botId == id) {
            memoryIdsToRemove.add(memory.id);
          };
        };
        for (memoryId in memoryIdsToRemove.values()) {
          memories.remove(memoryId);
        };
        bots.remove(id);
        true;
      };
    };
  };

  // Memory Management
  public shared ({ caller }) func addMemory(botId : Nat, memoryType : Text, content : Text, topic : Text, sentiment : Int) : async Nat {
    switch (bots.get(botId)) {
      case (null) { Runtime.trap("Bot not found") };
      case (?_) {
        let memory : Memory = {
          id = nextMemoryId;
          botId;
          memoryType;
          content;
          topic;
          timestamp = Time.now();
          sentiment;
        };
        memories.add(memory.id, memory);
        nextMemoryId += 1;
        memory.id;
      };
    };
  };

  public query ({ caller }) func getMemoriesForBot(botId : Nat) : async [Memory] {
    memories.values().toArray().filter(
      func(memory) {
        memory.botId == botId;
      }
    );
  };

  public shared ({ caller }) func deleteMemory(id : Nat) : async Bool {
    switch (memories.get(id)) {
      case (null) { false };
      case (?_) {
        memories.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func clearMemoriesForBot(botId : Nat) : async {
    removedCount : Nat;
  } {
    var removedCount = 0;
    let memoryIdsToRemove = List.empty<Nat>();
    for (memory in memories.values()) {
      if (memory.botId == botId) {
        memoryIdsToRemove.add(memory.id);
      };
    };
    for (memoryId in memoryIdsToRemove.values()) {
      memories.remove(memoryId);
      removedCount += 1;
    };
    { removedCount };
  };

  type MemoryWithScore = {
    memory : Memory;
    score : Float;
  };

  func calculateRelevanceScore(memory : Memory, topic : Text) : Float {
    var score : Float = 0.0;

    let topicLower = topic.toLower();
    let contentLower = memory.content.toLower();
    let memoryTopicLower = memory.topic.toLower();

    func containsKeyword(text : Text, keyword : Text) : Bool {
      text.contains(#text keyword);
    };

    if (containsKeyword(contentLower, topicLower)) {
      score += 1.0;
    };
    if (containsKeyword(memoryTopicLower, topicLower)) {
      score += 1.0;
    };

    switch (memory.sentiment) {
      case (1) { score += 0.2 };
      case (0) { score += 0.1 };
      case (-1) { score -= 0.1 };
      case (_) {};
    };

    let currentTime = Time.now();
    let timeDiff = Int.abs(currentTime - memory.timestamp);
    if (timeDiff < 1_000_000_000 * 60 * 60 * 24 * 7) { // 1 week in nanoseconds
      score += 0.2;
    } else if (timeDiff < 1_000_000_000 * 60 * 60 * 24 * 30) { // 1 month
      score += 0.1;
    };

    score;
  };

  public query ({ caller }) func getRelevantMemories(botId : Nat, topic : Text, topN : Nat) : async [Memory] {
    let botMemories = memories.values().toArray().filter(
      func(memory) {
        memory.botId == botId;
      }
    );

    let memoriesWithScores = List.empty<MemoryWithScore>();
    for (memory in botMemories.values()) {
      let score = calculateRelevanceScore(memory, topic);
      memoriesWithScores.add({ memory; score });
    };

    let sortedMemories = memoriesWithScores.toArray().sort(
      func(a, b) { Float.compare(b.score, a.score) }
    );

    let sortedByScore = List.fromArray<MemoryWithScore>(sortedMemories);

    let resultMemories = sortedByScore.toArray().map(
      func(mws) { mws.memory }
    );

    resultMemories.sliceToArray(0, Nat.min(topN, resultMemories.size()));
  };

  func sliceToArray<T>(array : [T], start : Nat, end : Nat) : [T] {
    let length = array.size();
    let s = Nat.min(start, length);
    let e = Nat.min(Nat.max(end, s), length);
    array.sliceToArray(s, Nat.min(e, length));
  };
};
