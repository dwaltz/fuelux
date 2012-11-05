/*
 * Fuel UX Tree
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(function(require) {

	var $ = require('jquery');


	// SPINNER CONSTRUCTOR AND PROTOTYPE

	var Tree = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.tree.defaults, options);

		this.$element.on('click', '.tree-item', $.proxy( function(ev) { this.selectItem(ev.currentTarget); } ,this));
		this.$element.on('click', '.tree-folder-header', $.proxy( function(ev) { this.selectFolder(ev.currentTarget); } ,this));

		this.render();
	};

	Tree.prototype = {
		constructor: Tree,

		render: function () {
			this.populate(this.$element);
		},

		populate: function ($el) {
			var self = this;
			var loader = $el.parent().find('.tree-loader:eq(0)');

			loader.show();
			this.options.dataSource.data( $el.data(), function (items) {
				loader.hide();

				$.each( items.data, function(index, value) {
					var $entity;

					if(value.type === "folder") {
						$entity = self.$element.find('.tree-folder:eq(0)').clone().show();
						$entity.find('.tree-folder-name').html(value.name);
						$entity.find('.tree-loader').html(self.options.loadingHTML);
						$entity.find('.tree-folder-header').data(value);
					} else if (value.type === "item") {
						$entity = self.$element.find('.tree-item:eq(0)').clone().show();
						$entity.find('.tree-item-name').html(value.name);
						$entity.data(value);
					}

					if($el.hasClass('tree-folder-header')) {
						$el.parent().find('.tree-folder-content:eq(0)').append($entity);
					} else {
						$el.append($entity);
					}
				});
			});
		},

		selectItem: function (el) {
			var $el = $(el);
			var $all = this.$element.find('.tree-selected');
			var data = this.options.multiSelect ? [] : false;

			if (!this.options.multiSelect) {
				if( $all[0] !== $el[0]) {
					$all.removeClass('tree-selected')
						.find('i').removeClass('icon-ok').addClass('tree-dot');
					data = $el.data();
				}
			} else {
				$.each($all, function(index, value) {
					var $val = $(value);
					if( $val[0] !== $el[0] ) {
						data.push( $(value).data() );
					}
				});
			}

			if( $el.hasClass('tree-selected') ) {
				$el.removeClass ('tree-selected');
				$el.find('i').removeClass('icon-ok').addClass('tree-dot');
				if ( this.options.multiSelect && !data.length ) {
					data = false;
				}
			} else {
				$el.addClass ('tree-selected');
				$el.find('i').removeClass('tree-dot').addClass('icon-ok');
				if ( this.options.multiSelect ) {
					data.push( $el.data() );
				}
			}

			if( data ) {
				this.$element.trigger('select', {selected: data} );
			}

		},

		selectFolder: function (el) {
			var $el = $(el);
			var $par = $el.parent();

			if($el.find('.icon-folder-close').length) {
				if ($par.find('.tree-folder-content').children().length) {
					$par.find('.tree-folder-content:eq(0)').show();
				} else {
					this.populate( $el );
				}

				$par.find('.icon-folder-close:eq(0)')
					.removeClass('icon-folder-close')
					.addClass('icon-folder-open');

				this.$element.trigger('open', $el.data());
			} else {
				$par.find('.tree-folder-content:eq(0)').hide();

				$par.find('.icon-folder-open:eq(0)')
					.removeClass('icon-folder-open')
					.addClass('icon-folder-close');

				this.$element.trigger('close', $el.data());
			}
		}
	};


	// SPINNER PLUGIN DEFINITION

	$.fn.tree = function (option, value) {
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('tree');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('tree', (data = new Tree(this, options)));
			if (typeof option === 'string') methodReturn = data[option](value);
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.tree.defaults = {
		multiSelect: false,
		loadingHTML: '<div>Loading...</div>'
	};

	$.fn.tree.Constructor = Tree;

});
