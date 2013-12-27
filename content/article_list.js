/*****************************************************************************
 **
 ** Gofr
 ** https://github.com/melllvar/Gofr
 ** Copyright (C) 2013 Akop Karapetyan
 **
 ** This program is free software; you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation; either version 2 of the License, or
 ** (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with this program; if not, write to the Free Software
 ** Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 **
 ******************************************************************************
 */

// FIXME
var getPublishedDate = function(dateAsString) {
	var now = new Date();
	var date = new Date(dateAsString);
	
	var sameDay = now.getDate() == date.getDate() 
		&& now.getMonth() == date.getMonth() 
		&& now.getFullYear() == date.getFullYear();

	return dateTimeFormatter(date, sameDay);
};

var ArticleList = (function() {
	var _idCounter = 0;

	var articleMethods = {
		initDom: function() {
var sourceTitle = "AFAF";
			var article = this;
			var details = this.details;

			var $dom = $('<div />', { 'class': 'gofr-entry ' + article.domId})
				.append($('<div />', { 'class' : 'gofr-entry-item' })
					.append($('<div />', { 'class' : 'action-star' })
						.click(function(e) {
							// entry.toggleStarred();
							// e.stopPropagation();
						}))
					.append($('<span />', { 'class' : 'gofr-entry-source' })
						.text(sourceTitle))
					.append($('<a />', { 'class' : 'gofr-entry-link', 'href' : details.link, 'target' : '_blank' })
						.click(function(e) {
							// e.stopPropagation();
						}))
					.append($('<span />', { 'class' : 'gofr-entry-pubDate' })
						.text(getPublishedDate(article.time)))
					.append($('<div />', { 'class' : 'gofr-entry-excerpt' })
						.append($('<h2 />', { 'class' : 'gofr-entry-title' })
						// .append($('<a />', { 'class' : 'gofr-entry-title', 'href' : details.link, 'target' : '_blank' })
							// .click(function(e) {
							// 	entry.markAsRead();

							// 	// Prevent expansion
							// 	e.stopPropagation();
							// })
							.text(details.title))
						.append($('<span />', { 'class' : 'gofr-entry-source-mobile' })
							.text(" - " + sourceTitle))
						))
				.click(function() {
					// entry.select();
					
					// var wasExpanded = entry.isExpanded();

					// ui.collapseAllEntries();
					// if (!wasExpanded) {
					// 	entry.expand();
					// 	entry.scrollIntoView();
					// }
				});

			if (details.summary) {
				$dom.find('.gofr-entry-excerpt')
					.append($('<span />', { 'class' : 'gofr-entry-spacer' }).text(' - '))
					.append($('<span />', { 'class' : 'gofr-entry-summary' }).text(details.summary));
			}

			return $dom;
		}
	};

	var open = function(item) {
		_idCounter = 0;
		// lastContinued = continueFrom;

		$.getJSON('articles', {
			filter:   JSON.stringify(item.getFilter()),
			// 'continue': continueFrom ? continueFrom : undefined,
			// client:   clientId,
		})
		.success(function(response) {
			extend(response.articles);
			addPage(response.articles);

			// continueFrom = response.continue;
			// subscription.addPage(response.articles, response.continue);
		});
	};

	var extend = function(articles) {
		$.each(articles, function(index, article) {
			article.domId = 'article-' + _idCounter++;
			$.extend(article, articleMethods);
		});
	};

	var addPage = function(articles) {
		$.each(articles, function(index, article) {
			var $dom = article.initDom();
			$('#gofr-entries').append($dom);
		});
	};
/*
		'addPage': function(entries) {
			var subscription = this;
			var idCounter = $('#gofr-entries').find('.gofr-entry').length;

			$.each(entries, function() {
				var entry = this;
				var details = entry.details;

				// Inject methods
				for (var name in entryMethods)
					entry[name] = entryMethods[name];

				var entrySubscription = entry.getSubscription();
				if (!entrySubscription)
					return true; // May have been deleted on server; don't add it if so

				var sourceTitle = entrySubscription != null ? entrySubscription.title : null;

				entry.areExtrasDirty = true;
				entry.extras = { 'likeCount': 0 };
				entry.domId = 'gofr-entry-' + idCounter++;

//

				entry.syncView();
			});

			$('.next-page').remove();

			ui.onEntryListUpdate();

			if (continueFrom) {
				$('#gofr-entries')
					.append($('<div />', { 'class' : 'next-page' })
						.text(_l('Continue'))
						.click(function(e) {
							subscription.loadEntries();
						}));
			}
		},
*/
	return {
		open: open,
	};

	/*
	var _tree = {
		map: {},
		root: {
			items: [],
		},
		tags: [],
		views: [],
	};
	var _subscribers = [];
	var _views = [{
		 domId: 'sf-liked',
		 title: _l("Liked items"),
		filter: { 'p': 'like', },
	}, {
		 domId: 'sf-starred',
		 title: _l("Starred items"),
		filter: { 'p': 'star', },
	}];

	var filterMethods = {
		createDom: function() {
			var title = this.getTitle();
			var item = this;
			var $item = $('<li />', { 'class' : 'subscription ' + item.domId });

			$item
				.append($('<div />', { 'class' : 'subscription-item' })
					.attr('title', title)
					.append($('<span />', { 'class' : 'chevron' }))
					.append($('<img />', { 
						'class' : 'subscription-icon', 
						'src': 'content/favicon-placeholder.png' 
					}))
					.append($('<span />', { 'class' : 'subscription-title' })
						.text(title))
					.click(function(e) {
						$('#subscriptions').find('.subscription.selected').removeClass('selected');
						$item.addClass('selected');

						notify('onScopeChange', item);
					}));

			return $item;
		},
		compareTo: function(anotherFilter) {
			var aTitle = this.getTitle().toLowerCase();
			var bTitle = anotherFilter.getTitle().toLowerCase();

			if (aTitle < bTitle)
				return -1;
			else if (aTitle > bTitle)
				return 1;

			return 0;
		},
		getTitle: function() {
			return this.title;
		},
		supportsFilteringByProperty: function() {
			return false;
		},
		supportsAggregateActions: function() {
			return false;
		},
		getDom: function() {
			return $('#subscriptions').find('.' + this.domId);
		},
	};
	var scopedMethods = $.extend({}, filterMethods, {
		supportsFilteringByProperty: function() {
			return true;
		},
		supportsAggregateActions: function() {
			return true;
		},
		createScopedDom: function() {
			var $dom = this.createDom();

			$dom.find('.subscription-item')
				.append($('<span />', { 'class' : 'subscription-unread-count' }));

			return $dom;
		},
		updateUnreadCount: function(updateParent /* = true *) {
			if (typeof updateParent === 'undefined')
				updateParent = true;

			var $dom = this.getDom();
			var $item = $dom.find('> .subscription-item');
			var $title = $item.find('.subscription-title');
			var $unreadCount = $item.find('.subscription-unread-count');

			$title.text(this.getTitle());
			$unreadCount.text(_l("(%d)", [ this.unread ]));
			$item.toggleClass('has-unread', this.unread > 0);
			$dom.toggleClass('no-unread', this.unread < 1);

			var len = $title.outerWidth() + $unreadCount.outerWidth() + 14;
			var available = $item.width() - $title.offset().left;

			$item.toggleClass('too-long', len >= available);

			if (updateParent && this.parent)
				this.parent.updateUnreadCount();
		},
	});
	var rootMethods = $.extend({}, scopedMethods, {
		initDom: function() {
			return this.createScopedDom();
		},
	});
	var subscriptionMethods = $.extend({}, scopedMethods, {
		initDom: function() {
			var $dom = this.createScopedDom();

			$dom.addClass('leaf');
			$dom.find('.subscription-icon').attr('src', this.getFavIconUrl());

			return $dom;
		},
		getFavIconUrl: function() {
			if (this.favIconUrl)
				return this.favIconUrl;

			return '/content/favicon-default.png';
		},
	});
	var folderMethods = $.extend({}, scopedMethods, {
		initDom: function() {
			var $dom = this.createScopedDom();

			$dom.addClass('folder');
			$dom.find('.subscription-item')
				.append($('<span />', { 'class' : 'folder-toggle' })
					.click(function(e) {
						var $toggleIcon = $(this);
						$toggleIcon.toggleClass('folder-collapsed');
						if ($toggleIcon.hasClass('folder-collapsed'))
							$dom.find('ul').slideUp('fast');
						else
							$dom.find('ul').slideDown('fast');
						
						return false;
					}));

			return $dom;
		},
	});
	var tagMethods = $.extend({}, filterMethods, {
		initDom: function() {
			var $dom = this.createDom();

			$dom.addClass('tag');

			return $dom;
		},
	});
	var viewMethods = $.extend({}, filterMethods, {
		initDom: function() {
			return this.createDom();
		},
	});

	var notify = function(name, arg) {
		$.each(_subscribers, function(index, subscriber) {
			subscriber[name](arg);
		});
	};

	var buildDom = function() {
		var $parent = $('<ul />', { 'id': 'subscriptions' });

		// Build 'All items'
		var $allItems = _tree.root.initDom();
		$parent.append($allItems);

		// Build views
		$.each(_tree.views, function(index, item) {
			var $item = item.initDom();
			$parent.append($item);

			// Mark first tag
			if (index == 0)
				$item.addClass('first');
		});

		// Build subscriptions
		(function() {
			var buildSubDom = function($parent, items) {
				var sorted = items.slice().sort(function(a, b) {
					return a.compareTo(b);
				});

				$.each(sorted, function(index, item) {
					var $item = item.initDom();
					$parent.append($item);

					// Mark first subscription
					if (!item.parent && index == 0)
						$item.addClass('first');

					// Build sub-items
					if (item.items) {
						var $subRoot = $('<ul />');
						$item.append($subRoot);

						buildSubDom($subRoot, item.items);
					}
				});
			};

			buildSubDom($parent, _tree.root.items);
		})();

		// Build tags
		var sorted = _tree.tags.slice().sort(function(a, b) {
			return a.compareTo(b);
		});
		$.each(sorted, function(index, item) {
			var $item = item.initDom();
			$parent.append($item);

			// Mark first tag
			if (index == 0)
				$item.addClass('first');
		});

		$('#subscriptions').replaceWith($parent);

		// Update unread counts
		(function() {
			var updateUnread = function(parent) {
				$.each(parent.items, function(index, item) {
					item.updateUnreadCount(false);
					if (item.items)
						updateUnread(item);
				});
			};
			updateUnread(_tree.root);

			// Update 'all items'
			_tree.root.updateUnreadCount();
		})();
	};

	var initializeTree = function(response) {
		_tree.map = {};
		_tree.tags.length = 0;
		_tree.views.length = 0;

		// Initialize "All items"
		_tree.root = {
			domId:  'root',
			title:  _l("All items"),
			unread: 0,
			parent: null,
			items:  [],
		};
		$.extend(_tree.root, rootMethods);

		// Initialize folders
		var counter = 0;
		$.each(response.folders, function(index, folder) {
			folder.items = [];
			folder.domId = 'folder-' + counter++;
			folder.unread = 0;

			_tree.map[folder.id] = folder;
			_tree.root.items.push(folder);

			$.extend(folder, folderMethods);
		});

		// Initialize subscriptions
		$.each(response.subscriptions, function(index, sub) {
			var parent = _tree.map[sub.parent];
			if (!parent) {
				parent = _tree.root;
			} else {
				_tree.root.unread += sub.unread;
			}

			_tree.map[sub.id] = sub;

			sub.parent = parent;
			sub.domId = 'sub-' + counter++;

			parent.unread += sub.unread;
			parent.items.push(sub);

			$.extend(sub, subscriptionMethods);
		});

		// Initialize tags
		$.each(response.tags, function(index, tag) {
			tag.domId = 'tag-' + counter++;
			_tree.tags.push(tag);

			$.extend(tag, tagMethods);
		});

		// Initialize views
		$.each(_views, function(index, view) {
			_tree.views.push(view);

			$.extend(view, viewMethods);
		});
	};

	var refresh = function(reloadItems) {
		$.getJSON('subscriptions', {
		})
		.success(function(response) {
			initializeTree(response);
			buildDom();
		});
	};
*/
})();
