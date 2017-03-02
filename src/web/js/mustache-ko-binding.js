var MustacheBindingProvider = (function () {
  function MustacheBindingProvider() {
    var _this = this;
    var expressionRegex = /{{([\s\S]*?)}}/g;

    this.constructor = MustacheBindingProvider;

    this.preprocessNode = function (node) {
      if (node.nodeType === 3 && node.nodeValue) {
        // text node
        return _this.preprocessTextNode(node);
      } else if (node.nodeType === 1) {
        return _this.preprocessElementNode(node);
      }
    }

    this.preprocessTextNode = function (node) {
      var newNodes = replaceExpressionsInText(
        node.nodeValue, expressionRegex,
        function (expressionText) {
          var fchar = expressionText.charAt(0);
          if (fchar == '#') {
            expressionText = expressionText.substring(1);
            return [
              document.createComment("ko foreach: " + expressionText),
            ];
          } else if (fchar == '/') {
            return [document.createComment("/ko")];
          } else if (fchar == '^') {
            expressionText = expressionText.substring(1);
            return [document.createComment("ko ifnot: " + expressionText)];
          } else {
            return [
              document.createComment("ko text: " + expressionText),
              document.createComment("/ko")
            ];
          }
        });
      // Insert the resulting nodes into the DOM and remove the original
      // unpreprocessed node
      //console.log('node', node);
      //console.log('newNodes', newNodes);
      if (newNodes) {
        for (var i = 0; i < newNodes.length; i++) {
          node.parentNode.insertBefore(newNodes[i], node);
        }
        node.parentNode.removeChild(node);
        return newNodes;
      }
    }

    this.preprocessElementNode = function (node) {
      var attrs = node.attributes,
        toRemove = [],
        toBind = {},
        attrBinding = '',
        allBindings = '',
        current = node.attributes['data-bind'],
        bindingMap = {
          'value': 'value',
          'style': 'style',
          'disabled': 'disable',
          'checked': 'checked'
        };

      if (current) {
        allBindings = current.value;
      }

      for (var i = attrs.length - 1; i >= 0; i--) {
        var attr = attrs[i],
          bindingName = bindingMap[attr.name] || 'attr';
        //console.log(attr.name, bindingMap[attr.name], bindingName);
        exprText = replaceExpressionsInAttr(attr.value);
        if (exprText !== null) {
          toRemove.push(attr.name);
          if (typeof toBind[bindingName] === 'undefined') {
            toBind[bindingName] = [];
          }
          toBind[bindingName].push({
            'name': attr.name,
            'value': exprText
          });
        }
      }

      for (var i = 0, ln = toRemove.length; i < ln; i++) {
        node.removeAttribute(toRemove[i]);
      }

      for (var prop in toBind) {
        var binders = toBind[prop];
        if (binders && binders.length > 0) {
          for (var i = 0, ln = binders.length; i < ln; i++) {
            var term = binders[i];
            if (i > 0) {
              attrBinding += ', ';
            }
            if (prop === 'attr') {
              attrBinding += "'" + term.name + "': " + term.value;
            } else {
              attrBinding += term.value;
            }
          }
          if (prop === 'attr') {
            attrBinding = 'attr: {' + attrBinding + '}';
          } else {
            attrBinding = prop + ': ' + attrBinding;
          }
          if (allBindings === '') {
            allBindings = attrBinding;
          } else {
            allBindings += ', ' + attrBinding;
          }
        }
      }
      if (allBindings !== '') {
        node.setAttribute('data-bind', allBindings);
        //console.log(node, allBindings);
      }
    }

    function replaceExpressionsInText(text, expressionRegex, callback) {
      var prevIndex = expressionRegex.lastIndex = 0,
        resultNodes = null,
        match;

      // Find each expression marker, and for each one, invoke the callback
      // to get an array of nodes that should replace that part of the text
      while (match = expressionRegex.exec(text)) {
        var leadingText = text.substring(prevIndex, match.index);
        prevIndex = expressionRegex.lastIndex;
        resultNodes = resultNodes || [];

        // Preserve leading text
        if (leadingText) {
          resultNodes.push(document.createTextNode(leadingText));
        }

        resultNodes.push.apply(resultNodes, callback(match[1]));
      }

      // Preserve trailing text
      var trailingText = text.substring(prevIndex);
      if (resultNodes && trailingText) {
        resultNodes.push(document.createTextNode(trailingText));
      }

      return resultNodes;
    }

    function replaceExpressionsInAttr(text) {
      var prevIndex = expressionRegex.lastIndex = 0,
        resultText = '';
      // FIXME this breaks 2-way bindings
      while (match = expressionRegex.exec(text)) {
        var leadingText = text.substring(prevIndex, match.index);
        prevIndex = expressionRegex.lastIndex;
        if (leadingText) {
          if (resultText) {
            resultText += ' + ';
          }
          resultText += "'" + leadingText + "'";
        }
        if (resultText) {
          resultText += ' + ';
        }
        resultText += match[1];
      }

      return resultText || null;
    }

  }

  MustacheBindingProvider.prototype = ko.bindingProvider.instance;
  return MustacheBindingProvider;
})();