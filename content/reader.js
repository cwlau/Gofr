/*****************************************************************************
 **
 ** FRAE
 ** https://github.com/melllvar/frae
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
 
$().ready(function()
{
  var subscriptionMap = null;
  var continueFrom = null;
  var lastContinued = null;

  $('button.refresh').click(function()
  {
    refresh();
  });
  $('button.subscribe').click(function()
  {
    subscribe();
  });
  $('.select-article.up').click(function()
  {
    openArticle(-1);
  });
  $('.select-article.down').click(function()
  {
    openArticle(1);
  });

  var showToast = function(message, isError)
  {
    $('#toast span').text(message);
    $('#toast').attr('class', isError ? 'error' : 'info');

    if ($('#toast').is(':hidden'))
    {
      $('#toast')
        .fadeIn()
        .delay(8000)
        .fadeOut('slow'); 
    }
  };

  var _l = function(str, args)
  {
    // FIXME
    if (args)
      return vsprintf(str, args);

    return str;
  };

  var getPublishedDate = function(dateAsString)
  {
    var now = new Date();
    var date = new Date(dateAsString);
    
    var sameDay = now.getDate() == date.getDate() 
      && now.getMonth() == date.getMonth() 
      && now.getFullYear() == date.getFullYear();

    if (sameDay)
      return date.toLocaleTimeString();
    else
      return date.toLocaleDateString();
  };

  // Automatic pager

  $('.entries-container').scroll(function()
  {
    var pagerHeight = $('.next-page').outerHeight();
    if (!pagerHeight)
      return; // No pager

    if (lastContinued == continueFrom)
      return;

    var offset = $('#entries').height() - ($('.entries-container').scrollTop() + $('.entries-container').height()) - pagerHeight;
    if (offset < 36)
      $('.next-page').click();
  });

  // Default click handler

  $('html').click(function() 
  {
    $('.shortcuts').hide();
    $('.menu').hide();
    $('#floating-nav').hide();
  });

  // Default error handler

  $(document).ajaxError(function(event, jqxhr, settings, exception) 
  {
    var errorMessage;

    try 
    {
      var errorJson = $.parseJSON(jqxhr.responseText)
      errorMessage = errorJson.errorMessage;
    }
    catch (exception)
    {
      errorMessage = _l("An unexpected error has occurred. Please try again later.");
    }

    if (errorMessage != null)
      showToast(errorMessage, true);
    else if (errorJson.infoMessage != null)
      showToast(errorJson.infoMessage, false);
  });

  var subscriptionMethods = 
  {
    'getDom': function() 
    {
      return $('#subscriptions').find('.' + this.domId);
    },
    'isFolder': function()
    {
      return this.link == "";
    },
    'isRoot': function()
    {
      return this.id == "";
    },
    'addPage': function(entries)
    {
      var subscription = this;
      var idCounter = $('#entries').find('.entry').length;

      $.each(entries, function()
      {
        var entry = this;
        var details = entry.details;

        // Inject methods
        for (var name in entryMethods)
          entry[name] = entryMethods[name];

        var entrySubscription = entry.getSubscription();

        entry.domId = 'entry-' + idCounter++;
        var entryDom = $('<div />', { 'class' : 'entry ' + entry.domId})
          .data('entry', entry)
          .append($('<div />', { 'class' : 'entry-item' })
            .append($('<div />', { 'class' : 'action-star' })
              .click(function(e)
              {
                entry.toggleProperty("star");
                e.stopPropagation();
              }))
            .append($('<span />', { 'class' : 'entry-source' })
              .text(entrySubscription.title))
            .append($('<a />', { 'class' : 'entry-link', 'href' : details.link, 'target' : '_blank' })
              .click(function(e)
              {
                e.stopPropagation();
              }))
            .append($('<span />', { 'class' : 'entry-pubDate' })
              .text(getPublishedDate(details.published)))
            .append($('<div />', { 'class' : 'entry-excerpt' })
              .append($('<h2 />', { 'class' : 'entry-title' })
                .text(details.title))))
          .click(function() 
          {
            entry.select();
            
            var wasExpanded = entry.isExpanded();

            collapseAllEntries();
            if (!wasExpanded)
            {
              entry.expand();
              entry.scrollIntoView();
            }
          });

        if (details.summary)
        {
          entryDom.find('.entry-excerpt')
            .append($('<span />', { 'class' : 'entry-spacer' }).text(' - '))
            .append($('<span />', { 'class' : 'entry-summary' }).text(details.summary));
        }

        $('#entries').append(entryDom);

        entry.syncView();
      });

      $('.next-page').remove();

      if (continueFrom)
      {
        $('#entries')
          .append($('<div />', { 'class' : 'next-page' })
            .text(_l('Continue'))
            .click(function(e)
            {
              subscription.loadEntries();
            }));
      }
    },
    'loadEntries': function()
    {
      lastContinued = continueFrom;

      var subscription = this;
      var selectedFilter = $('.group-filter.selected-menu-item').data('value');

      $.getJSON('entries', 
      {
        'subscription': subscription.id,
        'filter':       selectedFilter,
        'continue':     continueFrom,
      })
      .success(function(response)
      {
        continueFrom = response.continue;
        subscription.addPage(response.entries, response.continue);
      });
    },
    'refresh': function() 
    {
      continueFrom = null;
      lastContinued = null;

      $('#entries').empty();
      this.loadEntries();
    },
    'select': function()
    {
      this.selectedEntry = null;

      $('#subscriptions').find('.subscription.selected').removeClass('selected');
      this.getDom().addClass('selected');

      // Update the entry header
      if (!this.link)
        $('.entries-header').text(this.title);
      else
        $('.entries-header').html($('<a />', { 'href' : this.link, 'target' : '_blank' })
          .text(this.title)
          .append($('<span />')
            .text(' »')));

      this.refresh();
      updateUnreadCount();
    },
    'syncView': function()
    {
      var feedDom = this.getDom();

      feedDom.find('.subscription-unread-count').text('(' + this.unread + ')');
      feedDom.find('.subscription-item').toggleClass('has-unread', this.unread > 0);
    },
  };

  var entryMethods = 
  {
    'getSubscription': function() 
    {
      return subscriptionMap[this.source];
    },
    'getDom': function() 
    {
      return $('#entries').find('.' + this.domId);
    },
    'hasProperty': function(propertyName)
    {
      return $.inArray(propertyName, this.properties) > -1;
    },
    'setProperty': function(propertyName, propertyValue)
    {
      if (propertyValue == this.hasProperty(propertyName))
        return; // Already set

      var entry = this;

      $.getJSON('setProperty', 
      {
        entry:        this.id,
        subscription: this.source,
        property:     propertyName,
        set:          propertyValue,
      })
      .success(function(properties)
      {
        delete entry.properties;

        entry.properties = properties;
        entry.syncView();

        if (propertyName == 'read')
        {
          var subscription = entry.getSubscription();
          if (propertyValue)
            subscription.unread -= 1;
          else
            subscription.unread += 1;

          subscription.syncView();
          updateUnreadCount();
        }
      });
    },
    'toggleProperty': function(propertyName)
    {
      this.setProperty(propertyName, 
        !this.hasProperty(propertyName));
    },
    'syncView': function()
    {
      this.getDom()
        .toggleClass('star', this.hasProperty('star'))
        .toggleClass('like', this.hasProperty('like'))
        .toggleClass('read', this.hasProperty('read'));
    },
    'isExpanded': function()
    {
      return this.getDom().hasClass('open');
    },
    'expand': function()
    {
      var entry = this;
      var details = entry.details;
      var subscription = this.getSubscription();
      var entryDom = this.getDom();

      if (this.isExpanded())
        return;

      if (!this.hasProperty('read'))
        this.setProperty('read', true);

      var content = 
        $('<div />', { 'class' : 'entry-content' })
          .append($('<div />', { 'class' : 'article' })
            .append($('<a />', { 'href' : details.link, 'target' : '_blank', 'class' : 'article-title' })
              .append($('<h2 />')
                .text(details.title)))
            .append($('<div />', { 'class' : 'article-author' })
              .append('from ')
              .append($('<a />', { 'href' : subscription.link, 'target' : '_blank' })
                .text(subscription.title)))
            .append($('<div />', { 'class' : 'article-body' })
              .append(details.content)))
          .append($('<div />', { 'class' : 'entry-footer'})
            .append($('<span />', { 'class' : 'action-star' })
              .click(function(e)
              {
                entry.toggleProperty("star");
              }))
            .append($('<span />', { 'class' : 'action-unread entry-action'})
              .text(_l('Keep unread'))
              .click(function(e)
              {
                entry.toggleProperty("read");
              }))
            // .append($('<span />', { 'class' : 'action-tag entry-action'})
            //   .text(entry.tags.length ? _l('Edit tags: %s', [ entry.tags.join(', ') ]) : _l('Add tags'))
            //   .toggleClass('has-tags', entry.tags.length > 0)
            //   .click(function(e)
            //   {
            //     editTags(entryDom);
            //   }))
            // .append($('<span />', { 'class' : 'action-like entry-action'})
            //   .text((entry.like_count < 1) ? _l('Like') : _l('Like (%s)', [entry.like_count]))
            //   .click(function(e)
            //   {
            //     toggleProperty(entryDom, "like");
            //   }))
          )
          .click(function(e)
          {
            e.stopPropagation();
          });

      if (details.author)
        content.find('.article-author')
          .append(' by ') // FIXME: localize
          .append($('<span />')
            .text(details.author));

      // Links in the content should open in a new window
      content.find('.article-body a').attr('target', '_blank');

      entryDom.toggleClass('open', true);
      entryDom.append(content);
    },
    'scrollIntoView': function()
    {
      this.getDom().scrollintoview({ duration: 0});
    },
    'collapse': function()
    {
      this.getDom()
        .removeClass('open')
        .find('.entry-content')
          .remove();
    },
    'select': function()
    {
      $('#entries').find('.entry.selected').removeClass('selected');
      this.getDom().addClass('selected');
    },
  };

  var initButtons = function()
  {
    $('button.filter').click(function(e)
    {
      var topOffset = 0;
      var selected = $('#menu-filter').find('.selected-menu-item');

      $('.menu').hide();
      $('#menu-filter')
        .show();

      if (selected.length)
        topOffset += selected.position().top;

      $('#menu-filter')
        .css(
        {
          top: $(this).offset().top - topOffset, 
          left: $(this).offset().left,
        });

      e.stopPropagation();
    });
  };

  var initMenus = function()
  {
    // Build the menus

    $('body')
      .append($('<ul />', { 'id': 'menu-filter', 'class': 'menu', 'data-dropdown': 'button.filter' })
        .append($('<li />', { 'class': 'menu-all-items group-filter' }).text(_l("All items")))
        .append($('<li />', { 'class': 'menu-new-items group-filter', 'data-value': 'unread' }).text(_l("New items")))
        .append($('<li />', { 'class': 'menu-starred-items group-filter', 'data-value': 'star' }).text(_l("Starred"))));

    $('.menu').click(function(event)
    {
      event.stopPropagation();
    });

    $('.menu li').click(function()
    {
      var item = $(this);
      var menu = item.closest('ul');

      var groupName = null;
      $.each(item.attr('class').split(/\s+/), function()
      {
        if (this.indexOf('group-') == 0)
        {
          groupName = this;
          return false;
        }
      });

      if (groupName)
      {
        $('.' + groupName).removeClass('selected-menu-item');
        item.addClass('selected-menu-item');
      }

      $(menu.data('dropdown')).text(item.text());

      menu.hide();
      onMenuItemClick(menu.data('object'), item);
    });
  };

  var onMenuItemClick = function(contextObject, menuItem)
  {
    if (menuItem.is('.menu-all-items, .menu-new-items, .menu-starred-items'))
    {
      var subscription = getSelectedSubscription();
      if (subscription != null)
        subscription.refresh();
    }
  };

  var collapseAllEntries = function()
  {
    $('.entry.open').removeClass('open');
    $('.entry .entry-content').remove();
  };

  // which: < 0 to select previous; > 0 to select next
  var selectArticle = function(which, scrollIntoView)
  {
    if (which < 0)
    {
      if ($('.entry.selected').prev('.entry').length > 0)
        $('.entry.selected')
          .removeClass('selected')
          .prev('.entry')
          .addClass('selected');
    }
    else if (which > 0)
    {
      var selected = $('.entry.selected');
      if (selected.length < 1)
        next = $('#entries .entry:first');
      else
        next = selected.next('.entry');

      $('.entry.selected').removeClass('selected');
      next.addClass('selected');

      if (next.next('.entry').length < 1)
        $('.next-page').click(); // Load another page - this is the last item
    }

    scrollIntoView = (typeof scrollIntoView !== 'undefined') ? scrollIntoView : true;
    if (scrollIntoView)
      $('.entry.selected').scrollintoview({ duration: 0});
  };

  // which: < 0 to open previous; > 0 to open next; 0 to toggle current
  var openArticle = function(which)
  {
    selectArticle(which, false);

    if (!$('.entry-content', $('.entry.selected')).length || which === 0)
      $('.entry.selected')
        .click()
        .scrollintoview();
  };

  var getSelectedSubscription = function()
  {
    if ($('.subscription.selected').length > 0)
      return $('.subscription.selected').data('subscription');

    return null;
  };

  var updateUnreadCount = function()
  {
    // Update the 'new items' caption in the dropdown to reflect
    // the unread count

    var selectedSubscription = getSelectedSubscription();
    var caption;

    if (!selectedSubscription || selectedSubscription.unread === null)
      caption = _l("New items");
    else if (selectedSubscription.unread == 0)
      caption = _l("No new items");
    else
      caption = _l("%1$s new item(s)", [selectedSubscription.unread]);

    var newItems = $('.menu-new-items');

    newItems.text(caption);
    if (newItems.is('.selected-menu-item'))
      $('.filter').text(caption);

    var totalUnread = 0;
    $(".subscription").each(function()
    {
      var subDom = $(this);
      var subscription = subDom.data('subscription');

      if (!subscription.isRoot())
        totalUnread += subscription.unread;
    });

    var root = $(".root.subscription").data("subscription");
    root.unread = totalUnread;
    root.syncView();

    $(".root.subscription").data("subscription").unread = totalUnread;

    // Update the title bar

    var title = '>:(';
    if (root.unread > 0)
      title += ' (' + root.unread + ')';

    document.title = title;
  };

  var loadSubscriptions = function()
  {
    $.getJSON('subscriptions', 
    {
    })
    .success(function(subscriptions)
    {
      var selectedSubscription = getSelectedSubscription();
      var selectedSubscriptionId = null;

      if (selectedSubscription != null)
        selectedSubscriptionId = selectedSubscription.id;

      $('#subscriptions').empty();

      if (subscriptionMap != null)
        delete subscriptionMap;

      var idCounter = 0;
      subscriptionMap = {};

      $.each(subscriptions, function()
      {
        var subscription = this;
        subscription.domId = 'sub-' + idCounter++;

        // Inject methods
        for (var name in subscriptionMethods)
          subscription[name] = subscriptionMethods[name];

        var subDom = $('<li />', { 'class' : 'subscription ' + subscription.domId })
          .data('subscription', subscription)
          .append($('<div />', { 'class' : 'subscription-item' })
            .append($('<span />', { 'class' : 'chevron' })
              .click(function(e)
              {
                // FIXME: show the menu
                e.stopPropagation();
              }))
            .append($('<div />', { 'class' : 'subscription-icon' }))
            .append($('<span />', { 'class' : 'subscription-title' })
              .text(subscription.title))
            .attr('title', subscription.title)
            .append($('<span />', { 'class' : 'subscription-unread-count' }))
            .click(function() 
            {
              subscription.select();
            }));

        if (subscription.isFolder())
          subDom.addClass('folder');
        if (subscription.isRoot())
          subDom.addClass('root');

        $('#subscriptions').append(subDom);

        subscriptionMap[subscription.id] = subscription;
        subscription.syncView();

        if (selectedSubscriptionId == subscription.id)
          selectedSubscription = subscription;
        else if (selectedSubscriptionId == null && subscription.isRoot())
          selectedSubscription = subscription;
      });

      selectedSubscription.select();
    });
  };

  var subscribe = function()
  {
    var feedUrl = prompt(_l('Enter the feed URL'));
    if (feedUrl)
    {
      $.post('subscribe', 
      {
        'url' : feedUrl,
      },
      function(response)
      {
        if (response.message)
          showToast(response.message, false);
      }, 'json');
    }
  };

  var refresh = function()
  {
    loadSubscriptions();
  };

  initMenus();
  initButtons();

  loadSubscriptions();
});