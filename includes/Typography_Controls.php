<?php
/**
 * Typography Controls Class
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon;

/**
 * Handles typography control components and functionality
 */
class Typography_Controls {

	/**
	 * Initialize the typography controls
	 */
	public function init() {
		// Typography panel is now handled by JavaScript
		// Assets are enqueued by the main plugin class
	}

	/**
	 * Enqueue typography control assets
	 * Note: Assets are now handled by the main plugin class to avoid conflicts
	 */
	public function enqueue_typography_controls() {
		// Assets are now enqueued by the main plugin class
		// This method is kept for compatibility but doesn't enqueue anything
	}

	/**
	 * Add typography panel to blocks
	 */
	public function add_typography_panel() {
		// This will be handled by JavaScript to add the panel to the block inspector
	}

	/**
	 * Get default typography values
	 *
	 * @return array
	 */
	private function get_default_typography_values() {
		return array(
			'lineHeight' => array(
				'min' => 0.5,
				'max' => 3.0,
				'step' => 0.1,
				'default' => 1.5,
				'units' => array(
					array(
						'value' => '',
						'label' => __( 'Unitless', 'forjeon' ),
					),
					array(
						'value' => 'em',
						'label' => 'em',
					),
					array(
						'value' => 'px',
						'label' => 'px',
					),
				),
			),
			'letterSpacing' => array(
				'min' => -0.1,
				'max' => 0.5,
				'step' => 0.01,
				'default' => 0,
				'units' => array(
					array(
						'value' => 'em',
						'label' => 'em',
					),
					array(
						'value' => 'px',
						'label' => 'px',
					),
				),
			),
			'textShadow' => array(
				'x' => array(
					'min' => -10,
					'max' => 10,
					'step' => 1,
					'default' => 0,
				),
				'y' => array(
					'min' => -10,
					'max' => 10,
					'step' => 1,
					'default' => 2,
				),
				'blur' => array(
					'min' => 0,
					'max' => 20,
					'step' => 1,
					'default' => 3,
				),
				'color' => '#000000',
			),
		);
	}

	/**
	 * Get text shadow presets
	 *
	 * @return array
	 */
	private function get_text_shadow_presets() {
		return array(
			'subtle' => array(
				'label' => __( 'Subtle', 'forjeon' ),
				'value' => array(
					'x' => 0,
					'y' => 1,
					'blur' => 2,
					'color' => 'rgba(0, 0, 0, 0.1)',
				),
			),
			'medium' => array(
				'label' => __( 'Medium', 'forjeon' ),
				'value' => array(
					'x' => 0,
					'y' => 2,
					'blur' => 4,
					'color' => 'rgba(0, 0, 0, 0.3)',
				),
			),
			'strong' => array(
				'label' => __( 'Strong', 'forjeon' ),
				'value' => array(
					'x' => 0,
					'y' => 3,
					'blur' => 6,
					'color' => 'rgba(0, 0, 0, 0.5)',
				),
			),
		);
	}

	/**
	 * Validate typography values
	 *
	 * @param array $values Typography values to validate.
	 * @return array
	 */
	public function validate_typography_values( $values ) {
		$validated = array();
		$defaults = $this->get_default_typography_values();

		// Validate line height
		if ( isset( $values['lineHeight'] ) ) {
			$line_height = $values['lineHeight'];
			if ( is_array( $line_height ) && isset( $line_height['value'], $line_height['unit'] ) ) {
				$value = floatval( $line_height['value'] );
				$unit = $line_height['unit'];
				
				// Check if unit is valid
				$valid_units = wp_list_pluck( $defaults['lineHeight']['units'], 'value' );
				if ( in_array( $unit, $valid_units, true ) ) {
					// Validate value range
					if ( $value >= $defaults['lineHeight']['min'] && $value <= $defaults['lineHeight']['max'] ) {
						$validated['lineHeight'] = $line_height;
					}
				}
			}
		}

		// Validate letter spacing
		if ( isset( $values['letterSpacing'] ) ) {
			$letter_spacing = $values['letterSpacing'];
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'], $letter_spacing['unit'] ) ) {
				$value = floatval( $letter_spacing['value'] );
				$unit = $letter_spacing['unit'];
				
				// Check if unit is valid
				$valid_units = wp_list_pluck( $defaults['letterSpacing']['units'], 'value' );
				if ( in_array( $unit, $valid_units, true ) ) {
					// Validate value range
					if ( $value >= $defaults['letterSpacing']['min'] && $value <= $defaults['letterSpacing']['max'] ) {
						$validated['letterSpacing'] = $letter_spacing;
					}
				}
			}
		}

		// Validate text shadow
		if ( isset( $values['textShadow'] ) ) {
			$text_shadow = $values['textShadow'];
			if ( is_array( $text_shadow ) ) {
				$valid_shadow = array();
				
				// Validate X offset
				if ( isset( $text_shadow['x'] ) ) {
					$x = intval( $text_shadow['x'] );
					if ( $x >= $defaults['textShadow']['x']['min'] && $x <= $defaults['textShadow']['x']['max'] ) {
						$valid_shadow['x'] = $x;
					}
				}

				// Validate Y offset
				if ( isset( $text_shadow['y'] ) ) {
					$y = intval( $text_shadow['y'] );
					if ( $y >= $defaults['textShadow']['y']['min'] && $y <= $defaults['textShadow']['y']['max'] ) {
						$valid_shadow['y'] = $y;
					}
				}

				// Validate blur radius
				if ( isset( $text_shadow['blur'] ) ) {
					$blur = intval( $text_shadow['blur'] );
					if ( $blur >= $defaults['textShadow']['blur']['min'] && $blur <= $defaults['textShadow']['blur']['max'] ) {
						$valid_shadow['blur'] = $blur;
					}
				}

				// Validate color
				if ( isset( $text_shadow['color'] ) ) {
					$color = sanitize_hex_color( $text_shadow['color'] );
					if ( $color ) {
						$valid_shadow['color'] = $color;
					}
				}

				// Only add if we have valid shadow values
				if ( count( $valid_shadow ) >= 3 ) {
					$validated['textShadow'] = $valid_shadow;
				}
			}
		}

		return $validated;
	}

	/**
	 * Get typography control settings for a specific block
	 *
	 * @param string $block_name Block name.
	 * @return array
	 */
	public function get_block_typography_settings( $block_name ) {
		$settings = array();

		// Check if block supports typography controls
		if ( $this->block_supports_typography( $block_name ) ) {
			$settings = array(
				'lineHeight' => true,
				'letterSpacing' => true,
				'textShadow' => true,
			);
		}

		return $settings;
	}

	/**
	 * Check if a block supports typography controls
	 *
	 * @param string $block_name Block name.
	 * @return bool
	 */
	private function block_supports_typography( $block_name ) {
		$typography_blocks = array(
			'core/paragraph',
			'core/heading',
			'core/list',
			'core/quote',
			'core/pullquote',
			'core/verse',
			'core/code',
			'core/preformatted',
		);

		return in_array( $block_name, $typography_blocks, true );
	}

	/**
	 * Get typography control CSS for a block
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function get_typography_css( $attributes ) {
		$css = '';

		// Line height
		if ( ! empty( $attributes['lineHeight'] ) ) {
			$line_height = $attributes['lineHeight'];
			if ( is_array( $line_height ) && isset( $line_height['value'], $line_height['unit'] ) ) {
				$value = $line_height['value'];
				$unit = $line_height['unit'];
				$css .= "line-height: {$value}{$unit};";
			}
		}

		// Letter spacing
		if ( ! empty( $attributes['letterSpacing'] ) ) {
			$letter_spacing = $attributes['letterSpacing'];
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'], $letter_spacing['unit'] ) ) {
				$value = $letter_spacing['value'];
				$unit = $letter_spacing['unit'];
				$css .= "letter-spacing: {$value}{$unit};";
			}
		}

		// Text shadow
		if ( ! empty( $attributes['textShadow'] ) ) {
			$text_shadow = $attributes['textShadow'];
			if ( is_array( $text_shadow ) ) {
				$shadow_parts = array();
				
				if ( isset( $text_shadow['x'] ) ) {
					$shadow_parts[] = $text_shadow['x'] . 'px';
				}
				
				if ( isset( $text_shadow['y'] ) ) {
					$shadow_parts[] = $text_shadow['y'] . 'px';
				}
				
				if ( isset( $text_shadow['blur'] ) ) {
					$shadow_parts[] = $text_shadow['blur'] . 'px';
				}
				
				if ( isset( $text_shadow['color'] ) ) {
					$shadow_parts[] = $text_shadow['color'];
				}

				if ( count( $shadow_parts ) >= 3 ) {
					$css .= 'text-shadow: ' . implode( ' ', $shadow_parts ) . ';';
				}
			}
		}

		return $css;
	}
}
