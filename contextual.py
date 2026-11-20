
# CyberShield Enhanced Analysis
# Human-in-the-Loop Contextual Assessment Engine


def assess_context(analysis, context):

    # Store observations derived from user-provided context
    observations = []

    # Read questionnaire responses
    emotional_impact = context["emotional_impact"]
    relationship = context["relationship"]
    repetition = context["repetition"]
    intention = context["intention"]

    # Check whether the user reports emotional distress
    if emotional_impact == "threatened":
        observations.append(
            "The user reports feeling threatened or unsafe."
        )

    elif emotional_impact == "hurt":
        observations.append(
            "The user reports feeling hurt or upset."
        )

    elif emotional_impact == "uncomfortable":
        observations.append(
            "The user reports feeling uncomfortable."
        )

    # Check whether the behavior was repeated
    if repetition == "repeated":
        observations.append(
            "The user reports that similar behavior has occurred repeatedly."
        )

    # Consider the relationship with the sender
    if relationship == "repeated_targeting":
        observations.append(
            "The user identifies the sender as someone who has repeatedly targeted them."
        )

    # Consider the user's interpretation of the interaction
    if intention == "intimidation":
        observations.append(
            "The user interprets the interaction as intimidation."
        )

    elif intention == "harassment":
        observations.append(
            "The user interprets the interaction as harassment."
        )

    elif intention == "joking":
        observations.append(
            "The user interprets the interaction as friendly joking."
        )

    # Identify the strongest original model signal
    highest_category = max(analysis, key=analysis.get)
    highest_score = analysis[highest_category]

    # Generate a transparent contextual interpretation
    if (
        repetition == "repeated"
        and intention in ("harassment", "intimidation")
    ):
        assessment = (
            "The reported repeated behavior and perceived "
            "harassment or intimidation raise concern about "
            "a possible pattern of cyberbullying."
        )

    elif intention == "joking" and repetition == "once":
        assessment = (
            "The user describes the interaction as friendly "
            "joking and an isolated incident. This context "
            "may affect how the language is interpreted, "
            "although harmful language can still occur."
        )

    elif emotional_impact == "threatened":
        assessment = (
            "The user reports feeling threatened or unsafe. "
            "The interaction warrants further contextual review."
        )

    else:
        assessment = (
            "The available contextual information does not "
            "establish a clear pattern of cyberbullying. "
            "Further review may be necessary."
        )

    return {
        "original_analysis": analysis,
        "strongest_model_category": highest_category,
        "strongest_model_score": highest_score,
        "contextual_observations": observations,
        "contextual_assessment": assessment,
        "disclaimer": (
            "This assessment combines automated model outputs "
            "with self-reported context. It is not a definitive "
            "determination of cyberbullying."
        )
    }
