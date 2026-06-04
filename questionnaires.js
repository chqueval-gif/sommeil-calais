/* =====================================================================
   Dr Quéval — Médecine du sommeil à Calais
   Auto-questionnaires interactifs avec calcul de score.
   - Échelle d'Epworth (somnolence, adulte)
   - Échelle de fatigue de Pichot (adulte)
   - Questionnaire de Chervin / PSQ-SRBD (enfant)
   Les questionnaires sont construits en JavaScript à partir de la
   configuration ci-dessous : pour modifier une question, il suffit
   d'éditer le tableau correspondant.
   ===================================================================== */

(function () {
  "use strict";

  var DOCTOLIB =
    "https://www.doctolib.fr/medecin-generaliste/calais/charles-hubert-queval";

  /* ---------- Configuration des trois questionnaires ---------- */
  var QUIZZES = {
    /* ----- ÉCHELLE D'EPWORTH (somnolence diurne) ----- */
    epworth: {
      intro:
        "Vous arrive-t-il de somnoler ou de vous endormir (et pas seulement de vous sentir fatigué) dans les situations suivantes ? Répondez en pensant à votre vie récente.",
      options: [
        { label: "Jamais", value: 0 },
        { label: "Faible", value: 1 },
        { label: "Moyenne", value: 2 },
        { label: "Forte", value: 3 }
      ],
      questions: [
        "Assis en train de lire",
        "En train de regarder la télévision",
        "Assis, inactif, dans un lieu public (cinéma, théâtre, réunion)",
        "Passager d'une voiture roulant sans arrêt pendant une heure",
        "Allongé pour vous reposer l'après-midi quand les circonstances le permettent",
        "Assis en train de parler avec quelqu'un",
        "Assis au calme après un déjeuner sans alcool",
        "Au volant d'une voiture immobilisée depuis quelques minutes dans un embouteillage"
      ],
      max: 24,
      interpret: function (s) {
        if (s <= 7)
          return {
            level: "ok",
            title: "Pas de somnolence diurne anormale",
            text:
              "Votre score ne traduit pas de somnolence excessive en journée. Si vous présentez malgré tout d'autres symptômes (ronflement, fatigue, pauses respiratoires), une consultation reste utile."
          };
        if (s <= 10)
          return {
            level: "warn",
            title: "Somnolence diurne légère",
            text:
              "Votre score évoque une somnolence diurne légère. Un avis médical peut être utile, en particulier en présence de ronflement ou de pauses respiratoires."
          };
        if (s <= 15)
          return {
            level: "alert",
            title: "Somnolence diurne modérée",
            text:
              "Votre score évoque une somnolence diurne modérée. Une consultation de médecine du sommeil est conseillée."
          };
        return {
          level: "alert",
          title: "Somnolence diurne sévère",
          text:
            "Votre score évoque une somnolence diurne sévère. Une consultation est recommandée, notamment pour rechercher une apnée du sommeil."
        };
      }
    },

    /* ----- ÉCHELLE DE FATIGUE DE PICHOT ----- */
    pichot: {
      intro:
        "Au cours des derniers temps, dans quelle mesure les affirmations suivantes vous correspondent-elles ?",
      options: [
        { label: "Pas du tout", value: 0 },
        { label: "Un peu", value: 1 },
        { label: "Moyennement", value: 2 },
        { label: "Beaucoup", value: 3 },
        { label: "Extrêmement", value: 4 }
      ],
      questions: [
        "Je manque d'énergie",
        "Tout demande un effort",
        "Je me sens faible à certains endroits du corps",
        "J'ai les bras ou les jambes lourds",
        "Je me sens fatigué(e) sans raison",
        "J'ai envie de m'allonger pour me reposer",
        "J'ai du mal à me concentrer",
        "Je me sens fatigué(e), lourd(e) et engourdi(e)"
      ],
      max: 32,
      interpret: function (s) {
        if (s < 22)
          return {
            level: "ok",
            title: "Pas de fatigue significative",
            text:
              "Votre score ne traduit pas de fatigue significative. En cas de symptômes persistants, n'hésitez pas à consulter."
          };
        return {
          level: "alert",
          title: "Fatigue significative",
          text:
            "Votre score (supérieur ou égal à 22) évoque une fatigue significative. Une consultation est conseillée pour en rechercher la cause, notamment un trouble du sommeil."
        };
      }
    },

    /* ----- QUESTIONNAIRE DE CHERVIN / PSQ-SRBD (enfant) ----- */
    chervin: {
      intro:
        "À remplir par un parent, en pensant au comportement habituel de votre enfant pendant son sommeil et dans la journée. « Je ne sais pas » n'est pas compté dans le score.",
      options: [
        { label: "Oui", value: 1 },
        { label: "Non", value: 0 },
        { label: "Je ne sais pas", value: null }
      ],
      questions: [
        "Pendant son sommeil, votre enfant ronfle-t-il plus de la moitié du temps ?",
        "Ronfle-t-il toujours ?",
        "Ronfle-t-il fort ?",
        "A-t-il une respiration bruyante ou laborieuse pendant son sommeil ?",
        "Avez-vous déjà observé des pauses respiratoires (arrêts de la respiration) ?",
        "Vous êtes-vous déjà inquiété(e) de sa respiration pendant son sommeil ?",
        "Avez-vous déjà dû le secouer pour qu'il recommence à respirer ?",
        "Respire-t-il par la bouche pendant la journée ?",
        "A-t-il la bouche sèche au réveil le matin ?",
        "Mouille-t-il son lit la nuit (énurésie) ?",
        "Se réveille-t-il le matin sans se sentir reposé ?",
        "Présente-t-il une somnolence dans la journée ?",
        "Un enseignant ou un adulte a-t-il remarqué qu'il paraît somnolent en journée ?",
        "Est-il difficile à réveiller le matin ?",
        "Se plaint-il de maux de tête au réveil ?",
        "A-t-il, à un moment, cessé de grandir à un rythme normal ?",
        "Est-il en surpoids ?",
        "Semble-t-il ne pas écouter quand on lui parle directement ?",
        "A-t-il du mal à organiser ses tâches et ses activités ?",
        "Est-il facilement distrait par ce qui l'entoure ?",
        "Remue-t-il les mains ou les pieds, ou se tortille-t-il sur son siège ?",
        "Agit-il souvent comme s'il était « monté sur ressorts » ?"
      ],
      max: 22,
      interpret: function (s) {
        if (s <= 8)
          return {
            level: "ok",
            title: "Risque faible",
            text:
              "Le score de votre enfant est inférieur au seuil d'alerte. Si vous restez inquiet (ronflement, sommeil agité, fatigue, difficultés d'attention…), une consultation reste recommandée."
          };
        return {
          level: "alert",
          title: "Risque élevé de trouble respiratoire du sommeil",
          text:
            "Un score supérieur à 8 évoque un risque d'apnées du sommeil chez l'enfant. Il est conseillé de l'adresser en consultation pour un bilan."
        };
      }
    }
  };

  /* ---------- Petit utilitaire d'échappement HTML ---------- */
  function esc(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------- Construction d'un questionnaire dans le DOM ---------- */
  function buildQuiz(container) {
    var key = container.getAttribute("data-quiz");
    var cfg = QUIZZES[key];
    if (!cfg) return;

    var form = document.createElement("form");
    form.className = "quiz-form";
    form.setAttribute("novalidate", "novalidate");

    if (cfg.intro) {
      var intro = document.createElement("p");
      intro.className = "quiz-intro";
      intro.textContent = cfg.intro;
      form.appendChild(intro);
    }

    cfg.questions.forEach(function (question, qi) {
      var fs = document.createElement("fieldset");
      fs.className = "quiz-q";

      var legend = document.createElement("legend");
      legend.innerHTML =
        '<span class="quiz-q-num">' + (qi + 1) + "</span><span>" + esc(question) + "</span>";
      fs.appendChild(legend);

      var opts = document.createElement("div");
      opts.className = "quiz-opts";

      cfg.options.forEach(function (opt, oi) {
        var id = key + "-q" + qi + "-o" + oi;
        var label = document.createElement("label");
        label.className = "quiz-opt";
        label.setAttribute("for", id);

        var input = document.createElement("input");
        input.type = "radio";
        input.name = key + "-q" + qi;
        input.id = id;
        // value sert au calcul ; "na" = "je ne sais pas" (non comptabilisé)
        input.value = opt.value === null ? "na" : String(opt.value);

        var span = document.createElement("span");
        span.textContent = opt.label;

        label.appendChild(input);
        label.appendChild(span);
        opts.appendChild(label);
      });

      fs.appendChild(opts);
      form.appendChild(fs);
    });

    // Bouton de calcul
    var actions = document.createElement("div");
    actions.className = "quiz-actions";
    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "btn btn-primary";
    submit.textContent = "Calculer mon score";
    actions.appendChild(submit);
    form.appendChild(actions);

    // Zone de résultat (annoncée aux lecteurs d'écran)
    var result = document.createElement("div");
    result.className = "quiz-result";
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");
    result.hidden = true;
    form.appendChild(result);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var score = 0;
      var missing = false;

      cfg.questions.forEach(function (q, qi) {
        var sel = form.querySelector(
          'input[name="' + key + "-q" + qi + '"]:checked'
        );
        if (!sel) {
          missing = true;
          return;
        }
        if (sel.value !== "na") {
          score += Number(sel.value);
        }
      });

      if (missing) {
        result.hidden = false;
        result.className = "quiz-result quiz-result--info";
        result.innerHTML =
          "<p>Merci de répondre à toutes les questions pour calculer votre score.</p>";
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }

      var verdict = cfg.interpret(score);
      result.hidden = false;
      result.className = "quiz-result quiz-result--" + verdict.level;
      result.innerHTML =
        '<p class="quiz-score">Votre score : <strong>' +
        score +
        " / " +
        cfg.max +
        "</strong></p>" +
        '<p class="quiz-verdict-title">' +
        esc(verdict.title) +
        "</p>" +
        "<p>" +
        esc(verdict.text) +
        "</p>" +
        '<a class="btn btn-primary" href="' +
        DOCTOLIB +
        '" target="_blank" rel="noopener" aria-label="Prendre rendez-vous sur Doctolib (nouvel onglet)">Prendre rendez-vous</a>' +
        '<p class="quiz-disclaimer">Ce résultat est indicatif et ne constitue pas un diagnostic médical.</p>';
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    container.appendChild(form);
  }

  /* ---------- Initialisation ---------- */
  document.querySelectorAll(".quiz[data-quiz]").forEach(buildQuiz);
})();
