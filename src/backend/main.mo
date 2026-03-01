import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

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
};
