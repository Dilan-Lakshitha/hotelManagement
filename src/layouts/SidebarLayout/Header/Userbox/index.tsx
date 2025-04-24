import { use, useEffect, useRef, useState } from "react";

import { NavLink } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import { getDecodedToken } from "../../../../shared/service/managerService";
import { JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
  unique_name?: string;
}

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const user = {
    name: "Catherine Pike",
    // avatar: '/static/images/avatars/1.jpg',
    jobtitle: "Project Manager",
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [agencyeEmail, setAgencyEmail] = useState<string | null>(null);
  const [agencyName, setAgencyName] = useState<string | null>(null);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      setAgencyEmail((decoded as ExtendedJwtPayload).email ?? null);
      setAgencyName((decoded as ExtendedJwtPayload).unique_name ?? null);
    }
  }, []);

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" sx={{ bgcolor: "#261140", mr: 1 }}>
          {agencyName?.charAt(0).toUpperCase()}
        </Avatar>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{agencyName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {agencyeEmail}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" sx={{ bgcolor: "#261140", mr: 1 }}>
            {agencyName?.charAt(0).toUpperCase()}
          </Avatar>
          <UserBoxText>
            <UserBoxLabel variant="body1">{agencyName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {agencyeEmail}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem button to="/management/profile/details" component={NavLink}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Profile" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth component={NavLink} to="/signIn">
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
