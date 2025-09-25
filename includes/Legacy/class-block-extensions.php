<?php
/**
 * Block Extensions Class
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Legacy;

/**
 * Handles extending WordPress blocks with typography attributes
 */
class Block_Extensions {

	/**
	 * Initialize the block extensions
	 */
	public function init() {
		// Hook into block registration using a different approach.
		add_action( 'init', array( $this, 'register_block_extensions' ), 20 );

		// Hook into block rendering.
		add_filter( 'render_block', array( $this, 'render_block_with_typography' ), 10, 2 );

		// Hook into block supports using wp_loaded for better timing.
		add_action( 'wp_loaded', array( $this, 'add_typography_supports' ) );

		// Use block editor enqueue to register custom attributes.
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_attributes' ) );
	}

	/**
	 * Register block extensions
	 */
	public function register_block_extensions() {
		// Extend core blocks with typography attributes.
		$this->extend_core_blocks();
	}

	/**
	 * Extend core blocks with typography attributes
	 */
	private function extend_core_blocks() {
		// Define blocks that should have typography controls.
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

		// Extend each block type.
		foreach ( $typography_blocks as $block_name ) {
			$this->extend_block_type( $block_name );
		}
	}

	/**
	 * Extend a block type with typography attributes
	 *
	 * @param string $block_name Block name to extend.
	 */
	private function extend_block_type( $block_name ) {
		// Get the existing block type.
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );

		if ( ! $block_type ) {
			return;
		}

		// Add typography attributes if they don't exist.
		if ( ! isset( $block_type->attributes['lineHeight'] ) ) {
			$block_type->attributes['lineHeight'] = array(
				'type'    => 'string',
				'default' => '',
			);
		}

		if ( ! isset( $block_type->attributes['letterSpacing'] ) ) {
			$block_type->attributes['letterSpacing'] = array(
				'type'    => 'string',
				'default' => '',
			);
		}

		if ( ! isset( $block_type->attributes['textShadow'] ) ) {
			$block_type->attributes['textShadow'] = array(
				'type'    => 'object',
				'default' => null,
			);
		}
	}

	/**
	 * Add typography supports to blocks
	 */
	public function add_typography_supports() {
		// Define blocks that should have typography controls.
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

		foreach ( $typography_blocks as $block_name ) {
			// Add typography support to the block.
			add_filter(
				'block_type_metadata',
				function ( $metadata ) use ( $block_name ) {
					if ( isset( $metadata['name'] ) && $metadata['name'] === $block_name ) {
						// Ensure supports array exists.
						if ( ! isset( $metadata['supports'] ) ) {
							$metadata['supports'] = array();
						}

						// Add typography supports.
						$metadata['supports']['typography'] = array(
							'lineHeight'    => true,
							'letterSpacing' => true,
							'textShadow'    => true,
						);

						// Ensure attributes array exists.
						if ( ! isset( $metadata['attributes'] ) ) {
							$metadata['attributes'] = array();
						}

						// Add typography attributes.
						$metadata['attributes']['lineHeight'] = array(
							'type'    => 'string',
							'default' => '',
						);

						$metadata['attributes']['letterSpacing'] = array(
							'type'    => 'string',
							'default' => '',
						);

						$metadata['attributes']['textShadow'] = array(
							'type'    => 'object',
							'default' => null,
						);
					}
					return $metadata;
				}
			);
		}
	}

	/**
	 * Check if a block should be extended with typography controls
	 *
	 * @param array $metadata Block metadata.
	 * @return bool
	 */
	private function should_extend_block( $metadata ) {
		// Check if this is a text-based block.
		$text_blocks = array(
			'core/paragraph',
			'core/heading',
			'core/list',
			'core/quote',
			'core/pullquote',
			'core/verse',
			'core/code',
			'core/preformatted',
		);

		return in_array( $metadata['name'], $text_blocks, true );
	}

	/**
	 * Render block with typography styles
	 *
	 * @param string $block_content Block content.
	 * @param array  $block Block data.
	 * @return string
	 */
	public function render_block_with_typography( $block_content, $block ) {
		// Check if block has typography attributes.
		if ( ! $this->has_typography_attributes( $block ) ) {
			return $block_content;
		}

		// Generate typography styles.
		$typography_styles = $this->generate_typography_styles( $block );

		if ( empty( $typography_styles ) ) {
			return $block_content;
		}

		// Add typography styles to block.
		return $this->add_typography_styles( $block_content, $typography_styles, $block );
	}

	/**
	 * Check if block has typography attributes
	 *
	 * @param array $block Block data.
	 * @return bool
	 */
	private function has_typography_attributes( $block ) {
		return (
			( isset( $block['attrs']['lineHeight'] ) && null !== $block['attrs']['lineHeight'] && '' !== $block['attrs']['lineHeight'] ) ||
			( isset( $block['attrs']['letterSpacing'] ) && null !== $block['attrs']['letterSpacing'] && '' !== $block['attrs']['letterSpacing'] ) ||
			( isset( $block['attrs']['textShadow'] ) && null !== $block['attrs']['textShadow'] && '' !== $block['attrs']['textShadow'] )
		);
	}

	/**
	 * Generate typography styles for a block
	 *
	 * @param array $block Block data.
	 * @return array
	 */
	private function generate_typography_styles( $block ) {
		$styles = array();

		// Line height.
		if ( ! empty( $block['attrs']['lineHeight'] ) ) {
			$line_height = $block['attrs']['lineHeight'];

			// Handle object format {value: 1.5, unit: 'em'}.
			if ( is_array( $line_height ) && isset( $line_height['value'] ) ) {
				$value                 = $line_height['value'];
				$unit                  = $line_height['unit'] ?? '';
				$styles['line-height'] = $value . $unit;
			} elseif ( is_string( $line_height ) || is_numeric( $line_height ) ) {
				// Handle direct string/numeric values.
				$styles['line-height'] = $line_height;
			}
		}

		// Letter spacing.
		if ( ! empty( $block['attrs']['letterSpacing'] ) ) {
			$letter_spacing = $block['attrs']['letterSpacing'];

			// Handle object format {value: 0.1, unit: 'em'}.
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'] ) ) {
				$value                    = $letter_spacing['value'];
				$unit                     = $letter_spacing['unit'] ?? 'em';
				$styles['letter-spacing'] = $value . $unit;
			} elseif ( is_string( $letter_spacing ) || is_numeric( $letter_spacing ) ) {
				// Handle direct string/numeric values.
				$styles['letter-spacing'] = $letter_spacing;
			}
		}

		// Text shadow.
		if ( ! empty( $block['attrs']['textShadow'] ) ) {
			$shadow       = $block['attrs']['textShadow'];
			$shadow_value = $this->generate_text_shadow_value( $shadow );
			if ( $shadow_value ) {
				$styles['text-shadow'] = $shadow_value;
			}
		}

		return $styles;
	}

	/**
	 * Generate text shadow CSS value
	 *
	 * @param array $shadow Shadow configuration.
	 * @return string
	 */
	private function generate_text_shadow_value( $shadow ) {
		$parts = array();

		// X offset.
		if ( isset( $shadow['x'] ) ) {
			$parts[] = $shadow['x'] . 'px';
		}

		// Y offset.
		if ( isset( $shadow['y'] ) ) {
			$parts[] = $shadow['y'] . 'px';
		}

		// Blur radius.
		if ( isset( $shadow['blur'] ) ) {
			$parts[] = $shadow['blur'] . 'px';
		}

		// Color.
		if ( isset( $shadow['color'] ) ) {
			$parts[] = $shadow['color'];
		}

		return implode( ' ', $parts );
	}

	/**
	 * Add typography styles to block content
	 *
	 * @param string $block_content Block content.
	 * @param array  $styles Typography styles.
	 * @param array  $block Block data.
	 * @return string
	 */
	private function add_typography_styles( $block_content, $styles, $block ) {
		// Generate unique class name for this block.
		$class_name = 'forjeon-typography-' . $this->generate_block_id( $block );

		// Build style attribute.
		$style_attr = '';
		foreach ( $styles as $property => $value ) {
			// Handle array values (like {value: 1.5, unit: 'em'}).
			if ( is_array( $value ) ) {
				// Skip invalid array values.
				if ( ! isset( $value['value'] ) ) {
					continue;
				}

				// Convert array to CSS value.
				$css_value = $value['value'];
				if ( ! empty( $value['unit'] ) ) {
					$css_value .= $value['unit'];
				}
				$value = $css_value;
			}

			// Skip empty values.
			if ( empty( $value ) && '0' !== $value ) {
				continue;
			}

			$style_attr .= $property . ':' . $value . ';';
		}

		// If no styles, return original content.
		if ( empty( $style_attr ) ) {
			return $block_content;
		}

		// Add class and style to the first element.
		if ( preg_match( '/<([a-z0-9]+)/i', $block_content, $matches ) ) {
			$tag           = $matches[1];
			$replacement   = '<' . $tag . ' class="' . esc_attr( $class_name ) . '" style="' . esc_attr( $style_attr ) . '"';
			$block_content = preg_replace( '/<' . preg_quote( $tag, '/' ) . '/', $replacement, $block_content, 1 );
		}

		return $block_content;
	}

	/**
	 * Generate unique ID for a block
	 *
	 * @param array $block Block data.
	 * @return string
	 */
	private function generate_block_id( $block ) {
		// Use block ID if available.
		if ( ! empty( $block['attrs']['id'] ) ) {
			return sanitize_html_class( $block['attrs']['id'] );
		}

		// Generate hash from block content and attributes.
		$content = $block['innerContent'][0] ?? '';
		$attrs   = $block['attrs'] ?? array();
		$hash    = md5( $content . serialize( $attrs ) );

		return substr( $hash, 0, 8 );
	}

	/**
	 * Get typography attributes for a block
	 *
	 * @param string $block_name Block name.
	 * @return array
	 */
	public function get_typography_attributes( $block_name ) {
		$attributes = array();

		$attributes['lineHeight'] = array(
			'type'    => 'string',
			'default' => '',
		);

		$attributes['letterSpacing'] = array(
			'type'    => 'string',
			'default' => '',
		);

		$attributes['textShadow'] = array(
			'type'    => 'object',
			'default' => null,
		);

		return $attributes;
	}

	/**
	 * Enqueue block editor assets for attribute registration
	 */
	public function enqueue_block_attributes() {
		// Enqueue the block attributes script.
		wp_enqueue_script(
			'forjeon-block-attributes',
			FORJEON_PLUGIN_URL . 'src/utils/block-attributes.js',
			array( 'wp-hooks', 'wp-blocks' ),
			filemtime( FORJEON_PLUGIN_DIR . 'src/utils/block-attributes.js' ),
			true
		);
	}
}
