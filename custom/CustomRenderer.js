import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  assign
  
} from 'min-dash';

import {
  getRoundRectPath,
  getStrokeColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_YELLOW = '#ffc800',
      COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
  constructor(config,eventBus, bpmnRenderer, textRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.defaultFillColor = config && config.defaultFillColor;
    this.defaultStrokeColor = config && config.defaultStrokeColor;
    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer=textRenderer;
  }
  
  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    const suitabilityScore = this.getSituations(element);
    if(!isNil(suitabilityScore)){
      for (var i = 0; i < suitabilityScore.length; i++) {
        const color =this.getColor(suitabilityScore[i]);
  
        const rect = drawRect(parentNode, 100, 20, TASK_BORDER_RADIUS, color);
        var transformstring='translate(-20,'+(-10+(i*20))+')';
        svgAttr(rect, {
          transform: transformstring
        });
        var transformstring2='translate(-15,'+(5+(i*20))+')';

        var text = svgCreate('text'); 

        svgAttr(text, {
          fill: '#fff',
          transform: transformstring2
        });
        svgClasses(text).add('djs-label'); 
        this.renderEmbeddedLabel(parentNode, element, true ? 'center-top' : 'center-middle');

        svgAppend(text, document.createTextNode(suitabilityScore[i].situationname)); 
      
        svgAppend(parentNode, text);
      
  
      
  }
    }
    return shape;
    
  }

  getShapePath(shape) {
    if (is(shape, 'sitscope:SituationalScope')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSituations(element) {

    const businessObject = getBusinessObject(element);
  
    const { situations } = businessObject;

    return situations;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore.situationtrigger=="true") {
      return COLOR_GREEN;
    }else{
      return COLOR_RED;

    }

  }

  renderLabel(parentGfx, label, options) {
    options = assign({
      size: {
        width: 100
      }
    }, options);
  
    var text = this.textRenderer.createText(label || '', options);
  
    svgClasses(text).add('djs-label');
  
    svgAppend(parentGfx, text);
  
    return text;
  }
  
  renderEmbeddedLabel(parentGfx, element, align) {

    var semantic = getBusinessObject(element);
    return this.renderLabel(parentGfx, element.name, {
      box: element,
      align: align,
      padding: 5,
      style: {
        fill: getStrokeColor(element, this.defaultStrokeColor)
      }
    });
  }
  
    




}

CustomRenderer.$inject = [ 'config',
 'eventBus', 'bpmnRenderer', 'textRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}