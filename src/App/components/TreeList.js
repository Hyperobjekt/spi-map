const TREE = {
  id: 'root',
  childItems: [
    {
      id: 'bhn',
      name: 'Basic Human Needs',
      childItems: [],
      visible: true,
      collapsible: true,
      selected: false,
    },
  ],
};

const TreeListItem = ({
  id,
  name,
  visible,
  collapsible,
  expanded,
  selected,
  disabled,
  depth = 0,
  children,
  onToggle,
  onClick,
  className,
  ...props
}) => {
  const ChildWrapper = collapsible ? Collapse : React.Fragment;
  const isButton = typeof onClick === 'function';
  return (
    <ListItem
      className={clsx(
        'HypTreeListItem-root',
        `HypTreeListItem-depth${depth}`,
        expanded && 'HypNestedListItem-expanded',
        className,
      )}
      button={isButton}
      value={isButton ? id : undefined}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <ListItemText primary={name} />
      {collapsible && (
        <IconButton className="HypTreeListItem-toggle" size="small" value={id} onClick={onToggle}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )}
      <ChildWrapper in={expanded}>{children}</ChildWrapper>
    </ListItem>
  );
};

const TreeList = ({
  id,
  name,
  visible,
  collapsible,
  expanded,
  selected,
  disabled,
  listItemComponent,
  listComponent,
  childItems,
  depth = 0,
  ...props
}) => {
  const { listItemComponent, listComponent, childItems, depth = 0 } = props;
  const ListComponent = listComponent || List;
  const ListItemComponent = listItemComponent || ListItem;
  const ListItemProps =
    depth === 0
      ? {}
      : {
          id,
          name,
          visible,
          collapsible,
          selected,
          disabled,
          expanded,
          depth,
        };
  return (
    <ListItemComponent {...ListItemProps} {...props}>
      {childItems?.length > 0 && (
        <ListComponent>
          {childItems.map((child) => (
            <TreeList
              key={child.id}
              depth={depth + 1}
              listItemComponent={listItemComponent}
              listComponent={listComponent}
              {...child}
              {...props}
            />
          ))}
        </ListComponent>
      )}
    </ListItemComponent>
  );
};
