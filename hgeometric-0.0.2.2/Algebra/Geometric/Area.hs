-- Area.hs

-- hgeometric: A geometric library with bindings to GPC.
-- Area.hs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- See LICENSE

-- | 'Area' calculation.
module Algebra.Geometric.Area (Area (area)) where

-- | Calculates the 'area' of an geometric object.
class Area a where
    area :: a -> Double
