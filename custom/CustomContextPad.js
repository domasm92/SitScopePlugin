const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

export default class CustomContextPad {
  constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate,moddle) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.moddle=moddle;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }
    //contextPad._providers=[];
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate,
      moddle
    } = this;

    function appendServiceTask() {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:SubProcess');
          businessObject.situationscopename="Test";
          //businessObject.suitable = suitabilityScore;
          businessObject.situations=[];
          businessObject.isDefault=false;
          var situation =moddle.create('sitscope:Situation', {
            "situationname": "TestSituation",
            "situationtrigger": "true"
                    });
  
          businessObject.situations.push(situation);
          //businessObject.situation.situationname="CoffeeMachine available";
          //businessObject.situation.situationtrigger=true;
          const shape = elementFactory.createShape({
            type: 'bpmn:SubProcess',
            isExpanded: true,
            businessObject: businessObject
          });
    
          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      }
    }

    function appendServiceTaskStart() {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:SubProcess');
        businessObject.situationscopename="Test";
        //businessObject.suitable = suitabilityScore;
        businessObject.situations=[];
        businessObject.isDefault=false;
        var situation =moddle.create('sitscope:Situation', {
          "situationname": "TestSituation",
          "situationtrigger": "true"
                  });

        businessObject.situations.push(situation);
        //businessObject.situation.situationname="CoffeeMachine available";
        //businessObject.situation.situationtrigger=true;
        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          isExpanded: true,
          businessObject: businessObject
        });
        create.start(event, shape); 
      }
    }
    
    return {
      'append.high-task': {
        group: 'model',
        className: 'bpmn-icon-task',
        title: translate('Append Situational Scope'),
        action: {
          click: appendServiceTask(),
          dragstart: appendServiceTaskStart()
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
  'moddle'
];